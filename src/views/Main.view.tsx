import { useMemo, useState } from "react";
import { isEmpty } from "lodash";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { userRandomUser } from "../hooks/userRandomUser";
import { TableFilterEnum } from "../enums/TableFilters";

export const MainView = () => {
  const [isMultiColor, setIsMultiColor] = useState(false);

  const {
    getUsers,
    deleteUser,
    users,
    searchResults,
    search,
    isLoading,
    sortBy,
  } = userRandomUser();

  const itemTableBg = useMemo(
    () => (isMultiColor ? "even:bg-blue-300" : ""),
    [isMultiColor]
  );

  const data = useMemo(
    () => (isEmpty(searchResults) ? users : searchResults),
    [users, searchResults]
  );

  return (
    <main className="p-4 w-full bg-stone-900 flex content-center items-center flex-col">
      <h1 className="text-7xl text-center text-white mb-12">Mok Group Test</h1>

      <h1 className="text-4xl text-center text-white mb-12">
        {isLoading ? "Loading users..." : "User list"}
      </h1>

      {!isLoading && (
        <section className="mb-4 flex flex-row flex-nowrap justify-center">
          <button
            className="active:bg-stone-400 hover:bg-stone-500 bg-stone-600 rounded-md mr-2 py-2 px-4 text-center text-white"
            onClick={() => getUsers()}
          >
            Reset
          </button>

          <button
            className="active:bg-stone-400 hover:bg-stone-500 bg-stone-600 rounded-md mr-2 py-2 px-4 text-center text-white"
            onClick={() => setIsMultiColor(!isMultiColor)}
          >{`${isMultiColor ? "Single" : "Multi"} color`}</button>

          <section className="flex-1 rounded-md bg-stone-800 flex flex-row content-center items-center">
            <FaMagnifyingGlass className="m-3 cursor-pointer hover:text-lime-300 text-white text-xl mr-2" />
            <input
              placeholder="Search..."
              className="py-2 px-4 flex-1 bg-stone-800 focus:bg-stone-950 focus:text-white cursor-pointer rounded-md mx-auto"
              type="text"
              onChange={({ target }) => search(target.value)}
            />
          </section>
        </section>
      )}

      {!isLoading && (
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Picture
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 cursor-pointer hover:bg-stone-700"
                  onClick={() => sortBy(TableFilterEnum.NAME)}
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 cursor-pointer hover:bg-stone-700"
                  onClick={() => sortBy(TableFilterEnum.LAST_NAME)}
                >
                  Last name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 cursor-pointer hover:bg-stone-700"
                  onClick={() => sortBy(TableFilterEnum.COUNTRY)}
                >
                  Country
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={itemTableBg}>
              {data.map((user) => (
                <tr
                  key={user.login.uuid}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <img
                      src={user.picture.thumbnail}
                      alt={`${user.name.first}'s picture`}
                      className="rounded-full w-40 h-40"
                    />
                  </th>
                  <td className="px-6 py-4">{user.name.first}</td>
                  <td className="px-6 py-4">{user.name.last}</td>
                  <td className="px-6 py-4">{user.location.country}</td>
                  <td className="px-6 py-4">
                    <button
                      className="active:bg-stone-400 hover:bg-stone-500 bg-stone-600 rounded-md mr-2 py-2 px-4 text-center text-white"
                      onClick={() => deleteUser(user.login.uuid)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};
