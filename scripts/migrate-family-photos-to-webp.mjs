import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const rootDir = process.cwd();
const photosRootDir = path.join(rootDir, "public", "family-photos");
const dataFilePath = path.join(rootDir, "family-data", "people.json");
const portraitPlaceholderPath = path.join(photosRootDir, "portrait-placeholder.jpg");

const SOURCE_IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".bmp", ".gif", ".tif", ".tiff"]);

function publicPathToAbsolute(publicPath) {
  return path.join(rootDir, "public", publicPath.replace(/^\/+/, ""));
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function listSourceImageFiles(directoryPath) {
  if (!(await pathExists(directoryPath))) {
    return [];
  }

  const entries = await fs.readdir(directoryPath, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(directoryPath, entry.name))
    .filter((filePath) => SOURCE_IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase()));
}

async function emptyGeneratedWebpFiles(directoryPath) {
  if (!(await pathExists(directoryPath))) {
    return;
  }

  const entries = await fs.readdir(directoryPath, { withFileTypes: true });

  await Promise.all(
    entries
      .filter((entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === ".webp")
      .map((entry) => fs.unlink(path.join(directoryPath, entry.name))),
  );
}

function sanitizeFileStem(fileName) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function uniqueFileName(baseName, existingNames) {
  if (!existingNames.has(baseName)) {
    existingNames.add(baseName);
    return baseName;
  }

  let index = 2;
  let candidate = `${baseName}-${index}`;

  while (existingNames.has(candidate)) {
    index += 1;
    candidate = `${baseName}-${index}`;
  }

  existingNames.add(candidate);
  return candidate;
}

async function convertToWebp(sourcePath, destinationPath) {
  await sharp(sourcePath).rotate().webp({ quality: 86 }).toFile(destinationPath);
}

function pickPreferredSource(sourcePaths, slug) {
  if (sourcePaths.length === 0) {
    return null;
  }

  const exactMatch = sourcePaths.find(
    (sourcePath) => path.basename(sourcePath, path.extname(sourcePath)).toLowerCase() === slug,
  );

  return exactMatch ?? sourcePaths[0];
}

async function resolvePortraitSource(person) {
  const explicitSource = publicPathToAbsolute(person.portrait);
  if (
    await pathExists(explicitSource) &&
    SOURCE_IMAGE_EXTENSIONS.has(path.extname(explicitSource).toLowerCase())
  ) {
    return explicitSource;
  }

  const slugDirectory = path.join(photosRootDir, person.slug);
  const slugSourceFiles = (await listSourceImageFiles(slugDirectory)).sort((left, right) =>
    left.localeCompare(right),
  );
  const slugSource = pickPreferredSource(slugSourceFiles, person.slug);
  if (slugSource) {
    return slugSource;
  }

  const photoEntries = await fs.readdir(photosRootDir, { withFileTypes: true });

  const exactTopLevelSource = pickPreferredSource(
    photoEntries
      .filter((entry) => entry.isFile())
      .map((entry) => path.join(photosRootDir, entry.name))
      .filter((filePath) => SOURCE_IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase()))
      .filter(
        (filePath) => path.basename(filePath, path.extname(filePath)).toLowerCase() === person.slug,
      )
      .sort((left, right) => left.localeCompare(right)),
    person.slug,
  );
  if (exactTopLevelSource) {
    return exactTopLevelSource;
  }

  const firstName = person.slug.split("-")[0];
  const directoryCandidates = [];
  for (const entry of photoEntries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const entryName = entry.name.toLowerCase();
    if (!entryName.includes(firstName)) {
      continue;
    }

    const sourceFiles = await listSourceImageFiles(path.join(photosRootDir, entry.name));
    if (sourceFiles.length > 0) {
      directoryCandidates.push(...sourceFiles.sort((left, right) => left.localeCompare(right)));
    }
  }

  const fallbackDirectorySource = pickPreferredSource(directoryCandidates, person.slug);
  if (fallbackDirectorySource) {
    return fallbackDirectorySource;
  }

  const fileCandidates = photoEntries
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(photosRootDir, entry.name))
    .filter((filePath) => SOURCE_IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase()))
    .filter((filePath) => path.basename(filePath).toLowerCase().includes(firstName))
    .sort((left, right) => left.localeCompare(right));

  return fileCandidates[0] ?? portraitPlaceholderPath;
}

async function main() {
  const raw = await fs.readFile(dataFilePath, "utf8");
  const data = JSON.parse(raw);
  let placeholderCount = 0;

  for (const person of data.people) {
    const portraitSourcePath = await resolvePortraitSource(person);
    if (!portraitSourcePath) {
      throw new Error(`Missing portrait placeholder or source for ${person.id}.`);
    }

    const targetDirectory = path.join(photosRootDir, person.slug);
    const slugDirectory = path.join(photosRootDir, person.slug);
    const portraitSourceDirectory = path.dirname(portraitSourcePath);
    const sourceDirectories = new Set();

    if (portraitSourceDirectory !== photosRootDir) {
      sourceDirectories.add(portraitSourceDirectory);
    }

    if (slugDirectory !== portraitSourceDirectory && (await pathExists(slugDirectory))) {
      const slugSourceFiles = await listSourceImageFiles(slugDirectory);
      if (slugSourceFiles.length > 0) {
        sourceDirectories.add(slugDirectory);
      }
    }

    await fs.mkdir(targetDirectory, { recursive: true });
    await emptyGeneratedWebpFiles(targetDirectory);

    const portraitDestinationPath = path.join(targetDirectory, "index.webp");
    await convertToWebp(portraitSourcePath, portraitDestinationPath);
    if (path.resolve(portraitSourcePath) === path.resolve(portraitPlaceholderPath)) {
      placeholderCount += 1;
      console.warn(`Using placeholder portrait for ${person.id}`);
    }

    const gallerySources = new Map();
    for (const sourceDirectory of sourceDirectories) {
      const files = await listSourceImageFiles(sourceDirectory);

      for (const filePath of files) {
        if (path.resolve(filePath) === path.resolve(portraitSourcePath)) {
          continue;
        }

        gallerySources.set(path.resolve(filePath), filePath);
      }
    }

    const usedNames = new Set(["index"]);
    const galleryPublicPaths = [];

    for (const sourcePath of Array.from(gallerySources.values()).sort((left, right) => left.localeCompare(right))) {
      const stem = sanitizeFileStem(path.basename(sourcePath)) || "gallery";
      const fileName = `${uniqueFileName(stem, usedNames)}.webp`;
      const destinationPath = path.join(targetDirectory, fileName);

      await convertToWebp(sourcePath, destinationPath);
      galleryPublicPaths.push(`/family-photos/${person.slug}/${fileName}`);
    }

    person.portrait = `/family-photos/${person.slug}/index.webp`;
    person.gallery = galleryPublicPaths;
  }

  await fs.writeFile(dataFilePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");

  console.log(
    `Migrated ${data.people.length} people to folder-based WebP portraits (${placeholderCount} placeholder portraits).`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
