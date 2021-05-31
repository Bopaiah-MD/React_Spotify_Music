import React, { useState, useEffect } from 'react'
import useAuth from './useAuth'
import { Container, Form } from "react-bootstrap"
import SpotifyWebApi from "spotify-web-api-node"
import TrackSearchResult from "./TrackSearchResult"
import Player from './Player'

const spotifyApi = new SpotifyWebApi({
    clientId: "960f87b99f6f4a3eb3d37403ed0e6321",
})

function Dashboard({ code }) {

    const accessToken = useAuth(code)
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [playingTrack, setPlayingTrack] = useState()
    const [lyrics, setLyrics] = useState("")


    function chooseTrack(track) {
        setPlayingTrack(track)
        setSearch("")
        setLyrics("")
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
                        preview_url: track.preview_url
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
                placeholder="Search Songs/Artists"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
                {searchResults.map(track => (
                    <TrackSearchResult track={track} key={track.uri} chooseTrack={chooseTrack} />
                ))}
                {searchResults.length === 0 && (
          <div className="text-center" style={{ whiteSpace: "pre" }}>
            {lyrics}
          </div>
        )}
            </div>
            <div><Player native={true} accessToken={accessToken} trackUri={playingTrack?.uri} url={playingTrack}/></div>
           
        </Container>

    )
}

export default Dashboard
