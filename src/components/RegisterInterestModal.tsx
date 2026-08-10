import { useState } from "react";
import { useForm, ValidationError } from "@formspree/react";
import styles from "./RegisterInterestModal.module.css";
import { X } from "lucide-react";

export function RegisterInterestModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [state, handleSubmit] = useForm("mqpzpnzw");

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
          <X size={24} />
        </button>
        <div style={{ textAlign: "center" }}>
          <h2>Register Your Interest</h2>
          <p style={{ fontSize: "0.875rem", color: "#aaa", marginTop: "8px", lineHeight: 1.4, margin: "8px 0 0" }}>
            If you have a query or would like to discuss a project, we'd be happy to get in touch.
          </p>
        </div>
        {state.succeeded ? (
          <div className={styles.successMessage}>
            <p>Thanks for registering! We'll get in touch with you shortly.</p>
            <button onClick={onClose} className={styles.submitButton}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input id="name" type="text" name="name" required placeholder="John Doe" />
              <ValidationError prefix="Name" field="name" errors={state.errors} />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input id="email" type="email" name="email" required placeholder="john@example.com" />
              <ValidationError prefix="Email" field="email" errors={state.errors} />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="query">Query</label>
              <textarea id="query" name="query" required placeholder="I am looking to build..." rows={4} />
              <ValidationError prefix="Query" field="query" errors={state.errors} />
            </div>

            <button type="submit" className={styles.submitButton} disabled={state.submitting}>
              {state.submitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
