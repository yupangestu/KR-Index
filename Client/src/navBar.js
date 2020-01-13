import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { sortNames } from "./Components/components";
import styled from "styled-components";
import classes from "./Assets/classes/classes.json";

const searchWidth = "16rem";

const SearchBox = styled.div`
  width: ${searchWidth};
  background-color: white;
  color: black;
  position: absolute;
  overflow: auto;
  z-index: 2;
  right: 0;
  top: 3rem;
`;

const SearchListElement = styled.li`
  list-style-type: none;
  cursor: pointer;
  padding-left: 0.5rem;

  &:hover {
    background-color: #71b9f5;
  }
`;

const SearchInput = styled.input`
  margin-left: auto;
  width: ${searchWidth};
  padding-left: 0.5rem;

  &:focus {
    outline: none;
  }
`;

const classesSorted = [
  ...classes
    .map(v =>
      v.heroes.map(h => ({
        type: "heroes",
        heroClass: v.name,
        name: h,
        meta: {}
      }))
    )
    .flat(1)
];

const searchFilter = (names, query) => {
  const artifactNames = names.map(artifact => artifact.name);
  const artifactResults = artifactNames.filter(v =>
    v.toLowerCase().includes(query.toLowerCase())
  );
  const classesResults =
    query !== ""
      ? classesSorted.filter(v =>
          v.heroClass.toLowerCase().includes(query.toLowerCase())
            ? v.heroClass.toLowerCase() === query.toLowerCase()
            : v.name.toLowerCase().includes(query.toLowerCase())
        )
      : classesSorted;

  const resultArray = [
    ...sortNames(classesResults, "ASC"),
    ...artifactResults.map(artifact => ({
      type: "artifacts",
      name: artifact,
      meta: {}
    }))
  ];

  const posQuery = resultArray.map(v => v.name.toLowerCase().indexOf(query));
  const resultArraySort = resultArray
    .map((v, i) => ({ ...v, pos: posQuery[i] }))
    .sort((a, b) => a.pos - b.pos);

  return resultArraySort;
};

export const NavBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [artifacts, setArtifacts] = useState(
    JSON.parse(localStorage.getItem("Artifacts")) || []
  );
  const [search, setSeach] = useState(false);

  const ref = useRef(null);

  useEffect(() => {
    fetch(`https://krc-api.herokuapp.com/api/artifacts/`)
      .then(res => {
        return res.json();
      })
      .then(data => {
        setArtifacts(sortNames(data, "ASC"));
        localStorage.setItem(
          "Artifacts",
          JSON.stringify(sortNames(data, "ASC"))
        );
      });
  }, []);

  const handleClickOutside = event => {
    if (ref.current && !ref.current.contains(event.target)) setSeach(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <nav>
      <Link to={"/"} className={"navLink"}>
        <img
          src={"/favicon.png"}
          alt={"favicon.png"}
          style={{ width: 24, border: "none" }}
        />
      </Link>
      <Link to={"/heroes/"} className="navLink">
        Heroes
      </Link>
      <Link to={"/artifacts"} className={"navLink"}>
        Artifacts
      </Link>
      {renderSearch(
        search,
        ref,
        artifacts,
        searchQuery,
        setSearchQuery,
        setSeach
      )}
    </nav>
  );
};

const renderSearch = (
  search,
  ref,
  artifacts,
  searchQuery,
  setSearchQuery,
  setSeach
) => (
  <React.Fragment>
    {renderSearchBox(search, artifacts, ref, searchQuery)}
    <SearchInput
      placeholder="Search..."
      onChange={e => {
        setSearchQuery(e.currentTarget.value);
        setSeach(true);
      }}
      value={searchQuery}
      onClick={() => setSeach(true)}
      ref={ref}
    />
  </React.Fragment>
);

const renderSearchBox = (search, artifacts, ref, searchQuery) =>
  search && (
    <SearchBox ref={ref}>
      <ul style={{ margin: 0, padding: 0, maxHeight: "15rem" }}>
        {searchFilter(artifacts, searchQuery).map(item => (
          <SearchListElement
            key={item.name}
            onClick={() => window.open(`/${item.type}/${item.name}`, "_self")}
          >
            {item.name}
          </SearchListElement>
        ))}
      </ul>
    </SearchBox>
  );

export default NavBar;
