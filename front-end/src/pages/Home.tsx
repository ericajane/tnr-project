import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">TNR Dashboard</h1>
      <ul className="list-disc ml-6 space-y-2">
        <li>
          <Link to="/volunteers" className="text-blue-600 hover:underline">
            Volunteers
          </Link>
        </li>
        <li>
          <Link to="/cat-colony" className="text-blue-600 hover:underline">
            Cat & Colony Data
          </Link>
        </li>
        <li>
          <Link to="/veterinary" className="text-blue-600 hover:underline">
            Veterinary Appointments
          </Link>
        </li>
        <li>
          <Link to="/finance" className="text-blue-600 hover:underline">
            Finance and Fundraising
          </Link>
        </li>
        <li>
          <Link to="/equipment" className="text-blue-600 hover:underline">
            Equipment
          </Link>
        </li>
      </ul>
    </main>
  );
}
