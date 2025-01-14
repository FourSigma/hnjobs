
import SearchBar from "@/components/SearchBar";

export default async function Home() {


  return (
    <div className="container p-5 m-auto h-screen">
      <main className="flex flex-col items-center justify-center gap-3 m-auto">
        <div className="w-2/3">
          <SearchBar />
        </div>
      </main >
    </div >
  );
}
