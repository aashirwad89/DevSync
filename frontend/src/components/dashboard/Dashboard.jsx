import React, {useState, useEffect} from 'react'

function Dashboard() {
  const [repositories , setRepositaries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositaries , setSuggestedRepositaries] = useState([]);
const [searchResults , setSearchResults] = useState([]);


useEffect(()=>{
const userId = localStorage.getItem("userId");
const fetchRepositaries = async ()=>{
  const response = await fetch(`http://localhost:8000/repo/user/${userId}`)
  const data = await response.json();
  console.log(data);
}

fetchRepositaries();
}, []);

  return (
   <>
   
   </>
  )
}

export default Dashboard
