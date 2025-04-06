import EloProgressionByFighter from './components/EloProgressionByFighter';
import Fighter from './components/Fighter';

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-4xl font-semibold tracking-tight text-stone-800 dark:text-stone-100">
        MMA Elo Engine
      </h1>
      <p className="mb-4 text-stone-600 dark:text-stone-300">
        Welcome to the Elo rating explorer for professional fighters. Visualize historical progression and track rankings over time.
      </p>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="my-8">
          <EloProgressionByFighter />
        </div>
        <div className="my-8">
          <Fighter />
        </div>
      </section>
    </section >
  );
}
