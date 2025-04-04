import EloProgressionByFighter from './components/EloProgressionByFighter';

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-4xl font-semibold tracking-tight text-stone-800 dark:text-stone-100">
        MMA Elo Engine
      </h1>
      <p className="mb-4 text-stone-600 dark:text-stone-300">
        Welcome to the Elo rating explorer for professional fighters. Visualize historical progression and track rankings over time.
      </p>
      <div className="my-8">
        <EloProgressionByFighter />
      </div>
    </section>
  );
}
