import axios from "axios";
import { useEffect, useState } from "react";
import _ from "lodash";
import { TableFilterEnum } from "../enums/TableFilters";

export interface RandomUserResponseInfo {
  pages: number;
  results: number;
  seed: string;
  version: string;
}

export interface RandomUserDob {
  date: string;
  age: number;
}

export interface RandomUserId {
  name: string;
  value: string;
}

export interface RandomUserLocationCoordinates {
  latitude: string;
  longitude: string;
}

export interface RandomUserLocation {
  city: string;
  coordinates: RandomUserLocationCoordinates;
  country: string;
  postcode: number;
  state: string;
  street: RandomUserLocationStreet;
  timezone: RandomUserLocationTimezone;
}

export interface RandomUserLocationStreet {
  name: string;
  number: string;
}

export interface RandomUserLocationTimezone {
  description: string;
  offset: string;
}

export interface RandomUserLogin {
  md5: string;
  password: string;
  salt: string;
  sha1: string;
  sha256: string;
  username: string;
  uuid: string;
}

export interface RandomUserName {
  first: string;
  last: string;
  title: string;
}

export interface RandomUserPicture {
  large: string;
  medium: string;
  thumbnail: string;
}

export interface RandomUserRegistered {
  age: number;
  date: string;
}

export interface RandomUser {
  cell: string;
  dob: RandomUserDob;
  email: string;
  gender: string;
  id: RandomUserId;
  location: RandomUserLocation;
  login: RandomUserLogin;
  name: RandomUserName;
  nat: string;
  phone: string;
  picture: RandomUserPicture;
  registered: RandomUserRegistered;
}

export interface RandomUserResponseData {
  info: RandomUserResponseInfo;
  results: RandomUser[];
}

export interface RandomUserRequestParams {
  results?: number;
  gender?: string;
  password?: string;
}

export const userRandomUser = () => {
  const [info, setInfo] = useState<RandomUserResponseInfo>({
    pages: 0,
    results: 0,
    seed: "",
    version: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<RandomUser[]>([]);
  const [searchResults, setSearchResults] = useState<RandomUser[]>([]);
  const [sortUsersBy, setSortUsersBy] = useState<TableFilterEnum>(
    TableFilterEnum.NAME
  );

  const deleteUser = (uuid: string) =>
    setUsers(users.filter((user) => user.login.uuid !== uuid));

  const search = (query: string) => {
    if (!query) return setSearchResults([]);
     const results = users.filter((user) => {
      const nameMatched = new RegExp(query, "gi").test(user.name.first);
      const lastMatched = new RegExp(query, "gi").test(user.name.last);
      const countryMatched = new RegExp(query, "gi").test(
        user.location.country
      );

      return nameMatched || lastMatched || countryMatched;
    });

    setSearchResults(results)
  };

  const sortBy = (by: TableFilterEnum) => {
    let usersSorted = users;

    switch (by) {
      case TableFilterEnum.NAME:
        usersSorted = _.sortBy(users, (user: RandomUser) => user.name.first);
        break;

      case TableFilterEnum.LAST_NAME:
        usersSorted = _.sortBy(users, (user: RandomUser) => user.name.last);
        break;

      case TableFilterEnum.COUNTRY:
        usersSorted = _.sortBy(
          users,
          (user: RandomUser) => user.location.country
        );
        break;
    }

    if (by === sortUsersBy) usersSorted = usersSorted.reverse();
    else setSortUsersBy(by);

    setUsers(usersSorted);
  };

  const getUsers = async (params: RandomUserRequestParams = {}) => {
    try {
      setIsLoading(true);
      const usersResponse = await axios.get("https://randomuser.me/api/", {
        params: { ...params, results: params.results || 5000 },
      });
      const usersRaw: RandomUserResponseData = usersResponse.data;
      const { info, results } = usersRaw;
      setInfo(info);
      setUsers(results);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await getUsers();
    })();
  }, []);

  return { users, info, isLoading, getUsers, deleteUser, sortBy, search, searchResults };
};
