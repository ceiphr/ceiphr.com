import type { FunctionComponent } from 'react';

interface Props {
    history: HistoryEntry[];
}

const History: FunctionComponent<Props> = ({ history }) => {
    const formattedHistory = history.map((item) => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }));

    return (
        <div className="mb-4">
            <h2 className="text-3xl mt-4 mb-2">History</h2>
            <ul>
                {formattedHistory.map((item) => (
                    <li key={item.commit} className="py-2">
                        <p>
                            {item.message} ~ {item.author}
                        </p>
                        <p>
                            {item.date} - {item.commit}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default History;
