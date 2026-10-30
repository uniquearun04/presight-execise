export default function UserCard({user}) {
    const {
        avatar,
        firstName,
        lastName,
        age,
        nationality,
        hobbies = [],
    } = user;

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center gap-4">
                <img 
                    src={avatar} 
                    alt={`${firstName} ${lastName}`}
                    className="h-16 w-16 rounded-full object-cover"
                />
                <div >
                    <h2 className="text-lg font-semibold text-gray-900">
                        {firstName} {lastName}
                    </h2>

                    <p className="text-sm text-gray-500">
                        {age} years old
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                        📍 {nationality}
                    </p>
                </div>
            </div>

            <div className="mt-4 border-t border-gray-100 pt-3">
                <h3 className="mb-2 text-sm font-medium text-gray-700">
                    Hobbies
                </h3>

                <div className="flex flex-wrap gap-2">

                    {hobbies.length > 0 ? (
                        hobbies.map((hobby) => (
                            <span
                                key={hobby}
                                className="rounded-full bg-blue-50 px3 py-1 text-xs font-medium text-blue-700"
                            >

                            </span>
                        ))
                    ) : (
                        <span className="text-sm text-gray-400">
                            No hobbies listed
                        </span>
                    )}
                </div>
            </div>

        </div>
    );
}