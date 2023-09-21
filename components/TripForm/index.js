import useSWR from "swr";
import { useRouter } from "next/router";
import ConfirmationMessage from "../ConfirmationMessage";

export default function TripForm() {
  const { mutate } = useSWR("/api/trips");

  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const tripData = Object.fromEntries(formData);
    const response = await fetch("/api/trips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tripData),
    });
    if (!response.ok) {
      console.error(response.status);
      return;
    }
    mutate();
    router.push("/confirmation");
    event.target.reset();
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label htmlFor="title">Title (max. 30 characters)*</label>
          <input
            id="title"
            name="title"
            type="text"
            maxLength="30"
            required
          ></input>

          <label htmlFor="startDate">Starting date (dd/mm/yyyy)*</label>
          <input id="startDate" name="startDate" type="date" required></input>

          <label htmlFor="endDate">Ending date (dd/mm/yyyy)*</label>
          <input id="endDate" name="endDate" type="date" required></input>

          <label htmlFor="city">City (max. 30 characters)*</label>
          <input
            id="city"
            name="city"
            type="text"
            maxLength="30"
            required
          ></input>

          <label htmlFor="country">Country (max. 30 characters)*</label>
          <input
            id="country"
            name="country"
            type="text"
            maxLength="30"
            required
          ></input>

          <label htmlFor="image">Image (URL)*</label>
          <input
            id="image"
            name="image"
            type="text"
            placeholder="For example www.my-image.com"
            required
          ></input>

          <label htmlFor="description">
            Description (max. 150 characters)*
          </label>
          <textarea
            rows="8"
            cols="30"
            maxLength="150"
            id="description"
            name="description"
            type="text"
            required
            placeholder="Enter your description"
          ></textarea>
          <p>
            <span>150</span> characters left
          </p>

          <button type="submit"> + Add Trip</button>
        </fieldset>
        <p>* required form field</p>
      </form>

      <ConfirmationMessage button={"Cancel"} />
    </>
  );
}
