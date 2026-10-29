
export default function App() {

    const users = [
  {
    id: 1,
    first_name: 'Rahul',
    last_name: 'Sharma',
    age: 28,
    nationality: 'Indian',
    avatar: 'https://i.pravatar.cc/150?img=12',
    hobbies: ['Photography', 'Traveling', 'Cricket'],
  },
  {
    id: 2,
    first_name: 'Emma',
    last_name: 'Wilson',
    age: 32,
    nationality: 'British',
    avatar: 'https://i.pravatar.cc/150?img=47',
    hobbies: ['Reading', 'Swimming'],
  },
  {
    id: 3,
    first_name: 'John',
    last_name: 'Smith',
    age: 25,
    nationality: 'American',
    avatar: 'https://i.pravatar.cc/150?img=11',
    hobbies: ['Gaming', 'Cycling', 'Music'],
  },
];

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-blue-700">
        Presight User Directory
      </h1>
      <p className="mt-4 text-gray-600">
        React + Vite + Tailwind CSS is working!
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
    </main>
  );
}