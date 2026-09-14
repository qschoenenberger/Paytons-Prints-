import { useState, type FormEvent } from 'react';
import { FORMSPREE_ENDPOINT } from '../data/contact';
import styles from './Contact.module.css';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className={`container ${styles.wrap}`}>
      <h1>Commissions &amp; Contact</h1>
      <p>
        Interested in a custom drawing, or have a question about an order? Fill out the form below and
        Payton will get back to you.
      </p>

      {status === 'success' ? (
        <p className={styles.success}>Thanks! Your message has been sent.</p>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            Name
            <input type="text" name="name" required />
          </label>
          <label className={styles.field}>
            Email
            <input type="email" name="email" required />
          </label>
          <label className={styles.field}>
            What are you interested in?
            <select name="subject" defaultValue="Custom Drawing Request">
              <option>Custom Drawing Request</option>
              <option>Question about an order</option>
              <option>Something else</option>
            </select>
          </label>
          <label className={styles.field}>
            Message
            <textarea name="message" rows={5} required />
          </label>
          <button type="submit" className={styles.submit} disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending...' : 'Send Message'}
          </button>
          {status === 'error' && (
            <p className={styles.error}>Something went wrong sending your message &mdash; please try again.</p>
          )}
        </form>
      )}
    </div>
  );
}
