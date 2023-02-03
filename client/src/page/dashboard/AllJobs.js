import React from "react";
import { useEffect } from "react";
import JobsContainer from "../../components/JobsContainer";
import SearchContainer from "../../components/SearchContainer";
import { useAppContext } from "../../context/appContext";

const AllJobs = () => {
  const { getJobs } = useAppContext();
  useEffect(() => {
    getJobs();
  }, []);
  return (
    <>
      <SearchContainer />
      <JobsContainer />
    </>
  );
};

export default AllJobs;
