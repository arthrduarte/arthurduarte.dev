"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Quote } from "@/lib/db";
import { Plus, Trash2, Edit2, RefreshCw, Settings2 } from "lucide-react";

interface QuotesSectionProps {
  quotes: Quote[];
  onUpdate: () => void;
}

export function QuotesSection({ quotes, onUpdate }: QuotesSectionProps) {
  const [isManaging, setIsManaging] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [randomIndex, setRandomIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Pick a random quote on mount and when quotes change
  const displayedQuote = useMemo(() => {
    if (quotes.length === 0) return null;
    return quotes[randomIndex % quotes.length];
  }, [quotes, randomIndex]);

  // Fade in on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Reset visibility when quote changes for fade effect
  function shuffleQuote() {
    setIsVisible(false);
    setTimeout(() => {
      setRandomIndex((prev) => (prev + 1) % Math.max(quotes.length, 1));
      setIsVisible(true);
    }, 300);
  }

  async function handleAdd() {
    if (!text.trim()) return;
    await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, author }),
    });
    setText("");
    setAuthor("");
    setIsAdding(false);
    onUpdate();
  }

  async function handleEdit(id: number) {
    if (!text.trim()) return;
    await fetch(`/api/quotes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, author }),
    });
    setEditingId(null);
    setText("");
    setAuthor("");
    onUpdate();
  }

  async function handleDelete(id: number) {
    await fetch(`/api/quotes/${id}`, { method: "DELETE" });
    onUpdate();
  }

  function startEdit(quote: Quote) {
    setEditingId(quote.id);
    setText(quote.text);
    setAuthor(quote.author || "");
  }

  function cancelEdit() {
    setEditingId(null);
    setText("");
    setAuthor("");
    setIsAdding(false);
  }

  // Management mode - show all quotes for editing
  if (isManaging) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium tracking-tight">Manage Quotes</h2>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setIsAdding(true)}>
              <Plus className="size-4 mr-1" />
              Add
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsManaging(false)}>
              Done
            </Button>
          </div>
        </div>

        {isAdding && (
          <QuoteForm
            text={text}
            setText={setText}
            author={author}
            setAuthor={setAuthor}
            onSave={handleAdd}
            onCancel={() => {
              setIsAdding(false);
              setText("");
              setAuthor("");
            }}
          />
        )}

        <div className="space-y-3">
          {quotes.length === 0 && !isAdding && (
            <p className="text-muted-foreground text-sm py-8 text-center">
              No quotes yet. Add one to get started.
            </p>
          )}

          {quotes.map((quote) =>
            editingId === quote.id ? (
              <QuoteForm
                key={quote.id}
                text={text}
                setText={setText}
                author={author}
                setAuthor={setAuthor}
                onSave={() => handleEdit(quote.id)}
                onCancel={cancelEdit}
              />
            ) : (
              <QuoteManageItem
                key={quote.id}
                quote={quote}
                onEdit={() => startEdit(quote)}
                onDelete={() => handleDelete(quote.id)}
              />
            )
          )}
        </div>
      </div>
    );
  }

  // Display mode - show single inspiring quote
  if (!displayedQuote) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground mb-4">No quotes to inspire you yet.</p>
        <Button variant="outline" onClick={() => setIsManaging(true)}>
          <Plus className="size-4 mr-1" />
          Add your first quote
        </Button>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* The quote display */}
      <div
        className={`
          transition-all duration-500 ease-out
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
        `}
      >
        <blockquote className="relative">
          {/* Quote text */}
          <p className="text-sm font-medium ">
            {displayedQuote.text}
          </p>

          {/* Author attribution */}
          {displayedQuote.author && (
            <footer className="mt-2">
              <cite className="not-italic text-sm text-muted-foreground font-medium tracking-wide">
                — {displayedQuote.author}
              </cite>
            </footer>
          )}
        </blockquote>
      </div>
    </div>
  );
}

interface QuoteFormProps {
  text: string;
  setText: (v: string) => void;
  author: string;
  setAuthor: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

function QuoteForm({
  text,
  setText,
  author,
  setAuthor,
  onSave,
  onCancel,
}: QuoteFormProps) {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-lg bg-muted/50">
      <div className="flex flex-col gap-2">
        <Label htmlFor="quote-text">Quote</Label>
        <Textarea
          id="quote-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter quote..."
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="quote-author">Author (optional)</Label>
        <Input
          id="quote-author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author name"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={onSave}>
          Save
        </Button>
      </div>
    </div>
  );
}

interface QuoteItemProps {
  quote: Quote;
  onEdit: () => void;
  onDelete: () => void;
}

function QuoteManageItem({ quote, onEdit, onDelete }: QuoteItemProps) {
  return (
    <div className="group flex items-start justify-between gap-4 p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
      <div className="flex-1">
        <p className="italic">&ldquo;{quote.text}&rdquo;</p>
        {quote.author && (
          <p className="text-sm text-muted-foreground mt-1">
            — {quote.author}
          </p>
        )}
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon-xs" onClick={onEdit}>
          <Edit2 className="size-3" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button variant="ghost" size="icon-xs">
                <Trash2 className="size-3" />
              </Button>
            }
          />
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete quote?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={onDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
