import useDataBase from "./InitializeDB";

const { db, seeProperty } = useDataBase();

// Export an async function to fetch data from Firebase and return the listings array
export const fetchListings = async () => {
  try {
    const listingsData = await seeProperty();
    return listingsData;
  } catch (error) {
    // Handle any errors that might occur during data fetching
    console.error("Error fetching listings:", error);
    return [];
  }
};
