import LogEntry from "../../components/LogEntry";
import logs from "../../data/logs.json";

function LogsPage() {
  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-extrabold font-serif mb-8 text-center tracking-widest text-white">Captain's Log</h1>
      <div className="space-y-8 border-l-2 border-gray-700 pl-6">
        {logs.map((log) => (
          <LogEntry
            key={log.id}
            date={log.date}
            title={log.title}
            message={log.message}
            type={log.type}
          />
        ))}
      </div>
    </main>
  );
}

export default LogsPage;
