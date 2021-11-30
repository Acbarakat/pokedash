import * as React from "react";
import {
    VerticalTimeline,
    VerticalTimelineElement
}  from 'react-vertical-timeline-component';
import StarIcon from '@material-ui/icons/Star';
import { twitterapi } from "./common";
import 'react-vertical-timeline-component/style.min.css';

class Tweet extends React.Component {
    render(){
        let tweetDate = new Date(this.props.created_at);
        const dateOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        let dateElement = (
            <React.Fragment>
                {tweetDate.toLocaleDateString("en-US", dateOptions)}
                <br />
                {tweetDate.toLocaleTimeString()}
            </React.Fragment>
        );

        let mediaItem = '';
        if (this.props.attachments !== undefined){
            let key = this.props.attachments.media_keys[0];
            let mediaItemData = this.props.mediaData[key];
            switch(mediaItemData.type){
                case "photo":
                    mediaItem = (
                        <img
                            className="vertical-timeline-element-image"
                            src={mediaItemData.url}
                            alt={mediaItemData.alt_text || "taken from twitter"}
                            />
                    );
                    break;
                case "animated_gif":
                    let gifUrl = mediaItemData.preview_image_url;
                    gifUrl = gifUrl.replace(".jpg", ".mp4").replace("_thumb", "");
                    mediaItem = (
                        <video className="vertical-timeline-element-video" autoPlay loop muted playsInline>
                            <source src={gifUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    );
                    break;
                case "video":
                    // Currently not supported in Twitter API V2
                    mediaItem = (
                        <img
                            className="vertical-timeline-element-image"
                            src={mediaItemData.preview_image_url}
                            alt={mediaItemData.alt_text || "taken from twitter"}
                            />
                    );
                    break;
                default:
                    console.debug(`Unhandled media type ${mediaItemData.type}.`);
                    console.debug(mediaItemData);
            }
        }

        return (
            <VerticalTimelineElement
                key={this.props.id}
                date={dateElement}
                icon={<img src={this.props.icon} alt="pokemon twitter profile" />}
            >
            {mediaItem}
            <h1>{this.props.text}</h1>
          </VerticalTimelineElement>
        );
    }
}

class Pokenews extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            data: [],
        };
    }

    componentDidMount() {
        twitterapi.get("users/by/username/Pokemon", {
            params: {
                "user.fields": "profile_image_url"
            }
        })
        .then(
            async (response)=>{
                let userdata = response.data.data;
                twitterapi.get(`users/${userdata.id}/tweets`, {
                    params:{
                        "tweet.fields": "created_at,entities",
                        "expansions": "attachments.media_keys,in_reply_to_user_id",
                        "media.fields": "url,preview_image_url,alt_text",
                        "max_results": 25
                    }
                })
                .then(
                    async (response)=>{
                        let {data} = response.data;
                        let {media} = response.data.includes;
                        let mediaData = {};
                        media.forEach((v)=>{mediaData[v.media_key] = v});
                        // filter out replies
                        data = data.filter((v)=>v.in_reply_to_user_id===undefined);

                        let stateData = Object.assign(
                            userdata,
                            {data: data},
                            {mediaData: mediaData}
                        );

                        this.setState({...stateData});
                    })
                .catch(
                    (error) => console.error('Tweetdata ERROR: ', error)
                );
            })
        .catch(
            (error) => console.error('Userdata ERROR: ', error)
        );
    }

    render(){
        let timeline = this.state.data.map((entry)=>(
            <Tweet
                key={entry.id}
                {...entry}
                icon={this.state.profile_image_url}
                mediaData={this.state.mediaData}
            />
        ));
        return (
            <main>
                <VerticalTimeline>
                    {timeline}
                    <VerticalTimelineElement
                        iconStyle={{ background: '#ffcb05', color: '#fff' }}
                        icon={<StarIcon />}
                    />
                </VerticalTimeline>
            </main>
        )
    }
}

export default Pokenews;