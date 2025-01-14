
import SearchBar from "@/components/SearchBar";
export default async function Home() {


  return (
    <div className="container p-5 m-auto h-screen">
      <main className="flex flex-col items-center justify-center gap-3 my-auto h-full">
        <div className="w-2/3">
          <h1 className="text-4xl font-mono text-center mb-4">Job Search</h1>
          <SearchBar />
        </div>
      </main >
    </div >
  );
}
