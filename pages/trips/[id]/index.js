import Link from "next/link";
import ConfirmDelete from "@/components/ConfirmDelete";
import PackingListForm from "@/components/PackingListForm";
import Image from "next/image";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function DetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const {
    data: trip,
    isLoading,
    mutate,
  } = useSWR(id ? `/api/trips/${id}` : null);
  if (!trip || isLoading) {
    return "... is loading";
  }
  async function handleDeleteTrip() {
    await fetch(`/api/trips/${id}`, {
      method: "DELETE",
    });
    router.push("/");
  }

  async function handleAddToPackingList(item) {
    const updatedTrip = {
      ...trip,
      packingList: [...trip.packingList, { name: item }],
    };

    const response = await fetch(`/api/trips/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTrip),
    });

    if (!response.ok) {
      console.error(response.status);
      return;
    }

    mutate();

    // router.push("/confirmation");
  }

  return (
    <main>
      <Link href="/" aria-label="Go back to homepage">
        &larr;
      </Link>
      <Link href={`/trips/${id}/edit`}>Edit Trip</Link>
      <ConfirmDelete handleDeleteTrip={handleDeleteTrip} />
      <h1>My Trips</h1>
      <section>
        <Image src={trip.image} width={100} height={50} alt="" />
        <h2> {trip.title} </h2>
        {trip.city}, {trip.country}
        <br></br>
        {trip.startDate} - {trip.endDate}
        <h3>My plans</h3>
        <p>{trip.description}</p>
        <h3>{`${trip.title} packing list:`}</h3>
        <PackingListForm onHandleAddToPackingList={handleAddToPackingList} />
        <ul>
          {trip.packingList.map((item) => {
            return <li key={item._id}>{item.name}</li>;
          })}
        </ul>
      </section>
    </main>
  );
}
