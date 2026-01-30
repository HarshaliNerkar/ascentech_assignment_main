interface StatCardProps {
    label: string;
    value: number;
}

export default function StatCard({ label, value }: StatCardProps) {
    return (
        <div className="card hover:border-indigo-500/30 transition-colors">
            <p className="text-neutral-500 text-xs uppercase tracking-wider font-bold mb-1">{label}</p>
            <p className="text-4xl font-extrabold text-white">{value}</p>
        </div>
    );
}