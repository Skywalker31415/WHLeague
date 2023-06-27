import React, {useEffect} from "react";

export default function LeagueList()    {
    let to_return = ["fds"]
    useEffect(() => {
        // Using fetch to fetch the api from
        // flask server it will be redirected to proxy
        fetch("/league-list").then((res) =>
            res.json().then((data) => {
                // Setting a data from api
                
            })
        );
    }, []);
    console.log("made it")
    return to_return
}