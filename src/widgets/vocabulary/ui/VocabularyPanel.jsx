import React from "react";

function VocabularyPanel({ words }) {
  return (
    <article className="panel panel-feature">
      <div className="panel-header">
        <h2>Today's English Words</h2>
      </div>
      <ul className="vocab-word-list" aria-label="Today's vocabulary words">
        {words.map((item) => (
          <li key={item.word} className="vocab-word-card">
            <a
              href={item.dictionaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="vocab-card-link"
              aria-label={`Open dictionary for ${item.word}`}
            >
              <div className="vocab-word-head">
                <p className="vocab-word-title">{item.word}</p>
                <p className="vocab-word-pron">{item.pronunciation}</p>
              </div>
              <p className="vocab-meaning">
                <span>{item.meaning}</span>
              </p>
              <p className="vocab-example">
                Example: <span>{item.example}</span>
              </p>
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default VocabularyPanel;
