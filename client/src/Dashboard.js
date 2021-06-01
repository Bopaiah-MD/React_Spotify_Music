import React, { useState, useEffect } from 'react'
import useAuth from './useAuth'
import { Container, Form } from "react-bootstrap"
import SpotifyWebApi from "spotify-web-api-node"
import TrackSearchResult from "./TrackSearchResult"
import Player from './Player'

const spotifyApi = new SpotifyWebApi({
    clientId: "960f87b99f6f4a3eb3d37403ed0e6321",
})

//mock data to avoid server..
let testData = [{
    albumUrl: "https://i.scdn.co/image/ab67616d000048513e0936633c4c927ac22818e1",
    artist: "Jawsh 685",
    posterUrl: "https://i.scdn.co/image/ab67616d0000b2733e0936633c4c927ac22818e1",
    preview_url: "https://p.scdn.co/mp3-preview/efd5dc3b16c735e2cf39d3e27fce6ce36a26fbdb?cid=960f87b99f6f4a3eb3d37403ed0e6321",
    title: "Savage Love (Laxed – Siren Beat) [BTS Remix]",
    uri: "spotify:track:4TgxFMOn5yoESW6zCidCXL"
}]


function Dashboard({ code }) {
       
    const accessToken = useAuth(code)
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [playingTrack, setPlayingTrack] = useState()


    function chooseTrack(track) {
        setPlayingTrack(track)
        setSearch("")
      }

    useEffect(() => {
        if (!accessToken) return;

        spotifyApi.setAccessToken(accessToken);// udpate accesstoken here
    }, [accessToken])

    //search realted effect 
    useEffect(() => {
        if (!search) return setSearchResults([])
        if (!accessToken) return;

        let cancel = false
        spotifyApi.searchTracks(search).then(res => {
            if (cancel) return
            setSearchResults(
                res.body.tracks.items.map(track => {
                    //console.log("mdb tracks",track)
                    const smallestAlbumImage = track.album.images.reduce(
                        (smallest, image) => {
                            if (image.height < smallest.height) return image
                            return smallest
                        },
                        track.album.images[0]
                    )
                    
                    return {
                        artist: track.artists[0].name,
                        title: track.name,
                        uri: track.uri,
                        albumUrl: smallestAlbumImage.url,
                        preview_url: track.preview_url,
                        posterUrl : track.album.images[0].url
                    }
                })
            )
        })
        return () => (cancel = true) // cancel the request api if new api request fired.
    }, [search, accessToken])
    
    return (
        <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
            <Form.Control
                type="search"
                placeholder="Search Songs/Artists From Spotify API"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
                {searchResults.map(track => (
                    <TrackSearchResult track={track} key={track.uri} chooseTrack={chooseTrack} />
                ))}
                {searchResults.length === 0 && (
          <div className="text-center" style={{ whiteSpace: "pre" }}>
            <img src={playingTrack?.posterUrl || "https://wallpapercave.com/wp/wp2201811.jpg"} alt="https://cxp.asia/2020/wp-content/uploads/2021/04/450_1000.jpg" width="500" height="600"/>
          </div>
        )}
            </div>
            <div><Player native={true} accessToken={accessToken} trackUri={playingTrack?.uri} url={playingTrack}/></div>
           
        </Container>

    )
}

export default Dashboard
