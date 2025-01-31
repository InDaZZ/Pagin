import React, { useRef } from "react";
import "./styles.css";
import { requestUsers, User } from "./api";
import { useEffect, useState } from "react";
import { useDebounce } from "./utils";
import Loader from "./Loader";
// Дана функция requestUsers с аргументом типа Query, которая возвращает
// Promise<User[]>

// Написать приложение по получению пользователей
// - показывать лоадер при загрузке пользователей
// - добавить фильтрацию по имени
// - добавить фильтрацию по возрасту
// - добавить пагинацию

interface Query {
  name: string;
  age: string;
  limit: number;
  offset: number;
}

function App() {
  const nameRef = useRef("");
  const ageRef = useRef("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [byPage, setByPage] = useState<number>(2);
  const [isOffset, setOffset] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const findUsers = async () => {
    if (currentPage !== 1) {
      console.log("не равна");
      setCurrentPage(1);
      setOffset(0);
      return;
    } else
      try {
        setLoading(true);
        await requestUsers({
          name: nameRef.current.length !== 0 ? nameRef.current : "",
          age: ageRef.current.length !== 0 ? ageRef.current : "",
          limit: byPage,
          offset: isOffset,
        })
          .then((res) => setUsers(res))
          .finally(() => setLoading(false));
      } catch (e) {
        alert((e as { message: string }).message);
        setUsers([]);
      }
  };

  useEffect(() => {
    const request = async () => {
      try {
        setLoading(true);
        await requestUsers({
          name: nameRef.current.length !== 0 ? nameRef.current : "",
          age: ageRef.current.length !== 0 ? ageRef.current : "",
          limit: byPage,
          offset: isOffset,
        })
          .then((res) => setUsers(res))
          .finally(() => setLoading(false));
      } catch (e) {
        alert((e as { message: string }).message);
        setUsers([]);
      }
    };

    request();
  }, [byPage, currentPage]);

  useEffect(() => {
    const request = async () => {
      try {
        setLoading(true);
        await requestUsers({
          name: "",
          age: "",
          limit: byPage,
          offset: byPage * currentPage,
        })
          .then((res) => setUsers(res))
          .finally(() => setLoading(false));
      } catch (e) {
        alert((e as { message: string }).message);
        setUsers([]);
      }
    };

    request();
  }, []);

  return (
    <div>
      <div className="wraper">
        <input
          placeholder="Name"
          onChange={({ target }) => (nameRef.current = `${target.value}`)}
        />
        <input
          style={{ marginLeft: "8px" }}
          placeholder="Age"
          type="number"
          onChange={({ target }) => (ageRef.current = `${target.value}`)}
        />
        <button type="button" onClick={findUsers}>
          Найти
        </button>
        {isLoading ? (
          <Loader></Loader>
        ) : (
          users.map((user, index) => (
            <div
              key={user.id}
              style={{ marginTop: index === 0 ? "16px" : "4px" }}
            >
              {user.name}, {user.age}
            </div>
          ))
        )}

        <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
          <div>
            <span>By page:</span>
            <select
              style={{ marginLeft: "4px" }}
              onChange={({ target }) => {
                setByPage(Number(target.value));
              }}
            >
              <option value={2}>2</option>
              <option value={4}>4</option>
              <option value={8}>8</option>
            </select>
          </div>
          <button
            onClick={() => {
              if (currentPage !== 1) {
                setCurrentPage((prev) => prev - 1);
                setOffset((prev) => prev - byPage);
              }
            }}
          >
            prev
          </button>
          <span>page: {currentPage}</span>
          <button
            onClick={() => {
              setCurrentPage((prev) => prev + 1);
              setOffset((prev) => prev + byPage);
            }}
          >
            next
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
