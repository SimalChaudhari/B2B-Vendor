import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { NavUl } from 'src/components/nav-section';
import { NavList } from './nav-desktop-list';
import { fetchItems } from 'src/services/productApi';
import { useEffect, useState } from 'react';
import "./nav-desktop.css";
// ----------------------------------------------------------------------

export function NavDesktop({ data, sx }) {
  const navigate = useNavigate(); // Initialize useNavigate
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);  // Track hover state

  // Fetch items when the component mounts
  useEffect(() => {
    const getItems = async () => {
      try {
        const productData = await fetchItems(); // API call to fetch items
        setItems(productData.data); // Assuming data is an array of items or relevant data
        setLoading(false); // Stop loading
      } catch (err) {
        setError('Failed to fetch items');
        setLoading(false); // Stop loading on error
      }
    };

    getItems(); // Call the function to fetch items
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Render Loading, Error, or Navigation Data
  if (loading) {
    return <div>Loading...</div>; // You can create a LoadingComponent instead
  }

  if (error) {
    return <div>Error: {error}</div>; // You can create an ErrorComponent instead
  }

  // Extract unique groups from the items data
  const uniqueGroups = Array.from(
    new Set(items?.map(item => item.group)) // Create a Set of groups (Set automatically removes duplicates)
  );

  // Group items by `group` and structure them
  const groupedItems = uniqueGroups.map(group => {
    // Find all items belonging to the current group
    const groupItems = items.filter(item => item.group === group);

    // Group the subGroup1 items and their corresponding subGroup2 items
    const subGroups = groupItems.reduce((acc, item) => {
      // If subGroup1 is not already in the accumulator, initialize it
      if (!acc[item.subGroup1]) {
        acc[item.subGroup1] = [];
      }
      // Push corresponding subGroup2 to the subGroup1
      acc[item.subGroup1].push(item.subGroup2);
      return acc;
    }, {});

    // Convert the accumulator into the desired structure
    const subGroup1 = Object.keys(subGroups).map(subGroup => ({
      [subGroup]: {
        subGroup2: subGroups[subGroup]
      }
    }));

    // Return the group name and the structured subGroup1 data
    return { group, subGroup1 };
  });


  const handleProductClick = (category) => {
    // Redirect to /product with query string for category
    navigate(`/product?category=${encodeURIComponent(category)}`);
  };

  const handleSubGroup1Click = (subGroup1) => {
    // Redirect to /product with query string for subGroup1
    navigate(`/product?subGroup1=${encodeURIComponent(subGroup1)}`);
  };

  const handleSubGroup2Click = (subGroup2) => {
    // Redirect to /product with query string for subGroup1
    navigate(`/product?subGroup2=${encodeURIComponent(subGroup2)}`);
  };

  // Remove block syntax in the following functions
  const renderSubGroups = (subGroups) =>
    subGroups.map((item, index) => {
      const [key, value] = Object.entries(item)[0]; // Extract subGroup1 and corresponding subGroup2
  
      return (
        <li key={index} className="parent">
          <button
            type="button"
            onClick={() => handleSubGroup1Click(key)}
            className="group-btn"
          >
            {key} <span className="expand">»</span>
          </button>
          {value.subGroup2.length > 0 && (
            <ul className="child">
              {value.subGroup2.map((subGroup2Item, subIndex) => (
                <li key={subIndex}>
                  <button
                    type="button"
                    onClick={() => handleSubGroup2Click(subGroup2Item)}
                    className="group-btn"
                  >
                    {subGroup2Item}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    });
  
  const renderMenu = (menuItems) =>
    menuItems.map((groupItem, index) => (
      <li key={index} className="parent">
        <button
          type="button"
          onClick={() => handleProductClick(groupItem.group)}
          className="group-btn"
        >
          {groupItem.group} <span className="expand">»</span>
        </button>
        {groupItem.subGroup1.length > 0 && (
          <ul className="child">
            {renderSubGroups(groupItem.subGroup1)} {/* Render subgroups */}
          </ul>
        )}
      </li>
    ));
  



  return (
    <Stack component="nav" sx={{ height: 1, ...sx }}>
      <NavUl
        sx={{
          gap: 5,
          height: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {data.map((list) => (
          <div
            key={list.title}
            onMouseEnter={() => {
              if (list.title === 'Product') {
                setIsHovered(true);
              }
            }}
            onMouseLeave={() => {
              if (list.title === 'Product') {
                setIsHovered(false);
              }
            }}
            style={{ position: 'relative' }} // Make the parent div relative for positioning the child absolutely
          >
            <NavList data={list} />
            {list.title === 'Product' && isHovered && (
              <ul className="multilevel-dropdown-menu group-div">
                {renderMenu(groupedItems)} {/* Rendering the grouped items dynamically */}
              </ul>
            )}
          </div>
        ))}
      </NavUl>
    </Stack>
  );
}
