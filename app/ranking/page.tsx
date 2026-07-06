import fs from "fs";
import path from "path";
import Papa from "papaparse";
import Link from "next/link";

export default function Home() {
  const csv = fs.readFileSync(
    path.join(process.cwd(), "data", "score_included.csv"),
    "latin1"
  );

  const parsed = Papa.parse(csv, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });

  const allTickets = parsed.data as any[];

  const tickets = [...allTickets]
    .sort((a,b)=>Number(b.Score_Escalamiento)-Number(a.Score_Escalamiento))
    .slice(0,10);

  const totalTickets = allTickets.length;
  const avgScore = (
    allTickets.reduce((s,t)=>s+Number(t.Score_Escalamiento),0)/totalTickets
  ).toFixed(1);
  const avgAge = (
    allTickets.reduce((s,t)=>s+Number(t.Edad_Dias),0)/totalTickets
  ).toFixed(0);
  const analysts = new Set(allTickets.map((t:any)=>t.Analista)).size;
  const highRisk = allTickets.filter((t:any)=>Number(t.Score_Escalamiento)>=90).length;

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-4xl font-bold">🚨 CX Escalation Center</h1>
          <p className="mt-2 text-gray-500">
            Monitor de Backlog • Top Tickets por Score de Escalamiento
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">Total Tickets</p>
            <h2 className="mt-2 text-5xl font-bold">{totalTickets}</h2>
          </div>
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">High Risk</p>
            <h2 className="mt-2 text-5xl font-bold text-red-600">{highRisk}</h2>
          </div>
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">Avg Score</p>
            <h2 className="mt-2 text-5xl font-bold text-orange-500">{avgScore}</h2>
          </div>
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">Analysts</p>
            <h2 className="mt-2 text-5xl font-bold">{analysts}</h2>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow">
          <div className="border-b px-8 py-6">
            <h2 className="text-2xl font-bold">Top 10 Escalated Tickets</h2>
            <p className="mt-1 text-gray-500">
              Ordered by Escalation Score • Avg Age: {avgAge} days
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm uppercase tracking-wide text-gray-500">
                  <th className="px-6 py-4">Ticket</th>
                  <th>Priority</th>
                  <th>Subcategory</th>
                  <th>Age</th>
                  <th>Analyst</th>
                  <th className="pr-8 text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t:any)=>(
                  <tr key={t.Ticket_ID} className="border-b transition hover:bg-red-50">
                    <td className="px-6 py-5 font-semibold">{t.Ticket_ID}</td>
                    <td>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        t.Prioridad==="Alta"?"bg-red-100 text-red-700":
                        t.Prioridad==="Media"?"bg-yellow-100 text-yellow-700":
                        "bg-green-100 text-green-700"
                      }`}>
                        {t.Prioridad}
                      </span>
                    </td>
                    <td>{t.Subcategoria}</td>
                    <td>{t.Edad_Dias} d</td>
                    <td>{t.Analista}</td>
                    <td className={`pr-8 text-right text-lg font-bold ${
                      Number(t.Score_Escalamiento)>=95?"text-red-600":
                      Number(t.Score_Escalamiento)>=80?"text-orange-500":"text-green-600"
                    }`}>
                      {Number(t.Score_Escalamiento).toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap gap-3 border-t bg-gray-50 p-6">
            <Link href="/ranking" className="rounded-lg border border-indigo-600 px-5 py-3 text-indigo-600 hover:bg-indigo-50">
              Ver ranking completo
            </Link>

            <a
              href="https://i2trekviz.somoscopa.com/#/site/CopaVizHub/views/CXBC/MonitoreodeBacklog?:iid=1"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-indigo-600 px-5 py-3 text-indigo-600 hover:bg-indigo-50"
            >
              Acceder monitor de backlog
            </a>

            <button className="rounded-lg bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700">
              Reasignar ticket
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
