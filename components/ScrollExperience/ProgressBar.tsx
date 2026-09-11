"use client";

import type { ScrollSection } from "./types";

interface ProgressBarProps {
  sections: ScrollSection[];
  /** Called with the section index when a segment is activated. */
  onSeek: (index: number) => void;
  /** Registers the fill element the engine writes to on every scroll frame. */
  registerFill: (index: number) => (element: HTMLSpanElement | null) => void;
}

export function ProgressBar({
  sections,
  onSeek,
  registerFill,
}: ProgressBarProps) {
  return (
    <nav className="progress" aria-label="Sections">
      <ol className="progress__list">
        {sections.map((section, index) => (
          <li className="progress__item" key={section.id}>
            <button
              type="button"
              className="progress__button"
              onClick={() => onSeek(index)}
            >
              <span className="progress__label">
                {String(index + 1).padStart(2, "0")} — {section.title}
              </span>
              <span className="progress__track" aria-hidden="true">
                <span className="progress__fill" ref={registerFill(index)} />
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
