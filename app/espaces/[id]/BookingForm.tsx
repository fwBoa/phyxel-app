"use client";

import { useState } from "react";
import { createBooking } from "./actions";

interface BookingFormProps {
  spaceId: string;
  priceDay: number;
}

export default function BookingForm({ spaceId, priceDay }: BookingFormProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const numDays =
    startDate && endDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          ) + 1
        )
      : 0;

  const totalPrice = numDays * priceDay;

  async function handleSubmit(formData: FormData) {
    setMessage("");
    setError("");

    const result = await createBooking(formData);

    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      setMessage(result.success);
      setStartDate("");
      setEndDate("");
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <input type="hidden" name="space_id" value={spaceId} />

      <div>
        <label
          htmlFor="start_date"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Date de début
        </label>
        <input
          id="start_date"
          name="start_date"
          type="date"
          required
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label
          htmlFor="end_date"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Date de fin
        </label>
        <input
          id="end_date"
          name="end_date"
          type="date"
          required
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={startDate}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {numDays > 0 && (
        <div className="rounded-lg bg-secondary p-3 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>{numDays} jour{numDays > 1 ? "s" : ""}</span>
            <span>{priceDay.toLocaleString("fr-FR")} €/jour</span>
          </div>
          <div className="mt-1 flex justify-between font-medium text-foreground">
            <span>Total estimé</span>
            <span>{totalPrice.toLocaleString("fr-FR")} €</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Le prix final sera calculé à la confirmation.
          </p>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {message && (
        <p className="text-sm text-success">{message}</p>
      )}

      <button
        type="submit"
        className="w-full rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background hover:opacity-90 transition-opacity"
      >
        Demander une réservation
      </button>
    </form>
  );
}
