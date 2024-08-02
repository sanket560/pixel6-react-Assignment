import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import UserTableRow from "./UserTableRow";
import "../assets/styles/UserList.css";
import { FaFilter } from "react-icons/fa";
import { LuArrowUpDown } from "react-icons/lu";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [limit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ gender: "", country: "" });
  const [sort, setSort] = useState({ field: "id", order: "asc" }); // Initialize with a default field

  // Function to fetch users from the API, applying filters and sorting
  const fetchUsers = useCallback(
    async (pageNumber = 1) => {
      try {
        // Make API request to get users with pagination
        const response = await axios.get("https://dummyjson.com/users", {
          params: {
            limit,
            skip: (pageNumber - 1) * limit,
          },
        });

        let fetchedUsers = response.data.users;

        // Apply filters
        if (filters.gender) {
          fetchedUsers = fetchedUsers.filter(
            (user) => user.gender === filters.gender
          );
        }

        if (filters.country) {
          fetchedUsers = fetchedUsers.filter(
            (user) => user.country === filters.country
          );
        }

        // Apply sorting client-side
        if (sort.field) {
          fetchedUsers.sort((a, b) => {
            const valueA = sort.field === "name" ? a.firstName : a[sort.field];
            const valueB = sort.field === "name" ? b.firstName : b[sort.field];

            if (typeof valueA === "string" && typeof valueB === "string") {
              return sort.order === "asc"
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
            }

            if (valueA < valueB) {
              return sort.order === "asc" ? -1 : 1;
            }
            if (valueA > valueB) {
              return sort.order === "asc" ? 1 : -1;
            }
            return 0;
          });
        }

        // Update state with fetched users and total pages
        setUsers(fetchedUsers);
        setTotalPages(Math.ceil(response.data.total / limit));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    [filters, sort, limit]
  );

  // Fetch users whenever filters, sort, or page changes
  useEffect(() => {
    fetchUsers(page);
  }, [filters, sort, page, fetchUsers]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [name]: value };

      // Reset sort if "All" is selected
      if (name === "gender" && value === "") {
        setSort({ field: "", order: "asc" });
      }

      return updatedFilters;
    });
  };

  // Handle sort change
  const handleSortChange = (field) => {
    setSort((prevSort) => ({
      field,
      order:
        prevSort.field === field && prevSort.order === "asc" ? "desc" : "asc",
    }));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Render pagination buttons
  const renderPaginationButtons = () => {
    const pageNumbers = [];
    const maxPagesToShow = 4;
    const startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={i === page ? "active" : ""}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination">
        {startPage > 1 && (
          <button onClick={() => handlePageChange(startPage - 1)}>Prev</button>
        )}
        {pageNumbers}
        {endPage < totalPages && (
          <button onClick={() => handlePageChange(endPage + 1)}>Next</button>
        )}
      </div>
    );
  };

  return (
    <div className="container">
      <div className="filters">
        <h1>Employees</h1>
        <div>
          <FaFilter className="FiFilter" />
          <select className="filterOption" name="country">
            <option value="">Country</option>
            <option>United States</option>
          </select>
          <select
            name="gender"
            className="filterOption"
            value={filters.gender}
            onChange={handleFilterChange}
          >
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th onClick={() => handleSortChange("id")}>
              ID <LuArrowUpDown className="updown" />
            </th>
            <th>Image</th>
            <th onClick={() => handleSortChange("name")}>
              Full Name <LuArrowUpDown className="updown" />
            </th>
            <th>Demography</th>
            <th>Designation</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserTableRow key={user.id} user={user} />
          ))}
        </tbody>
      </table>
      {renderPaginationButtons()}
    </div>
  );
};

export default UserList;