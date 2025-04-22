import { useEffect, useState } from "react";
import "@/assets/css/playbackPage.css";
import NavBar from "@/components/navBar.tsx";
import { Link, useSearchParams } from "react-router";
import { getUrl } from "aws-amplify/storage";
import "@vidstack/react/player/styles/base.css";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  Button,
  Flex,
  Heading,
  Text,
  useAuthenticator,
  View,
  Menu,
  MenuItem,
  MenuButton,
} from "@aws-amplify/ui-react";
import Video from "@/types/video.ts";

function PlaybackPage() {
  const [tags, setTags] = useState([
    "TAG 1",
    "TAG 2",
    "TAG 3",
    "TAG 4",
    "TAG 5",
  ]);
  const [uploader, setUploader] = useState("Uploader Name");
  const [title, setTitle] = useState("title");
  const [description, setDescription] = useState("description");
  const [highResPresignedUrl, setHighResPresignedUrl] = useState<
    string | undefined
  >(undefined);
  const [mediumResPresignedUrl, setMediumResPresignedUrl] = useState<
    string | undefined
  >(undefined);
  const [lowResPresignedUrl, setLowResPresignedUrl] = useState<
    string | undefined
  >(undefined);
  const [ultraLowResPresignedUrl, setUltraLowResPresignedUrl] = useState<
    string | undefined
  >(undefined);
  const [searchParams] = useSearchParams();
  const { user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    const uuid = searchParams.get("v") ?? "";
    fetch(
      "https://t0cgas8vb5.execute-api.us-east-1.amazonaws.com/video/" + uuid,
    )
      .then((response) => response.json())
      .then((data: Video) => {
        setUploader(data.uploader);
        setTags(data.tags);
        setTitle(data.title);
        setDescription(data.description);
      })
      .catch((err: unknown) => {
        console.error("Failed to fetch video data:", err);
      });

    getUrl({
      options: {
        bucket: {
          bucketName: "cctv-transcoded-video-storage",
          region: "us-east-1",
        },
        validateObjectExistence: true,
        expiresIn: 300,
        useAccelerateEndpoint: false,
      },
      path: "mp4/" + uuid + "-high-res.mp4",
    })
      .then(function (result) {
        setHighResPresignedUrl(result.url.toString());
      })
      .catch((unknown: unknown) => {
        console.error("Failed to load video data:", unknown);
      });

    getUrl({
      options: {
        bucket: {
          bucketName: "cctv-transcoded-video-storage",
          region: "us-east-1",
        },
        validateObjectExistence: true,
        expiresIn: 300,
        useAccelerateEndpoint: false,
      },
      path: "mp4/" + uuid + "-medium-res.mp4",
    })
      .then(function (result) {
        setMediumResPresignedUrl(result.url.toString());
      })
      .catch((unknown: unknown) => {
        console.error("Failed to load video data:", unknown);
      });

    getUrl({
      options: {
        bucket: {
          bucketName: "cctv-transcoded-video-storage",
          region: "us-east-1",
        },
        validateObjectExistence: true,
        expiresIn: 300,
        useAccelerateEndpoint: false,
      },
      path: "mp4/" + uuid + "-low-res.mp4",
    })
      .then(function (result) {
        setLowResPresignedUrl(result.url.toString());
      })
      .catch((unknown: unknown) => {
        console.error("Failed to load video data:", unknown);
      });

    getUrl({
      options: {
        bucket: {
          bucketName: "cctv-transcoded-video-storage",
          region: "us-east-1",
        },
        validateObjectExistence: true,
        expiresIn: 300,
        useAccelerateEndpoint: false,
      },
      path: "mp4/" + uuid + "-ultra-low-res.mp4",
    })
      .then(function (result) {
        setUltraLowResPresignedUrl(result.url.toString());
      })
      .catch((unknown: unknown) => {
        console.error("Failed to load video data:", unknown);
      });
  }, [searchParams]);

  return (
    <View>
      <NavBar />
      <Flex
        direction={"column"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Heading level={2} fontWeight={"bold"} marginBottom={"1rem"}>
          {title}
        </Heading>

        <Flex
          direction={"column"}
          width={"100%"}
          maxWidth={"1400px"}
          backgroundColor={"black"}
          boxShadow={"0 4px 10px rgba(0, 0, 0, 0.3)"}
        >
          {highResPresignedUrl &&
          mediumResPresignedUrl &&
          lowResPresignedUrl &&
          ultraLowResPresignedUrl ? (
            <MediaPlayer
              title="Sprite Fight"
              controls={true}
              src={[
                {
                  src: highResPresignedUrl,
                  type: "video/mp4",
                  width: 1920,
                  height: 1080,
                },
                {
                  src: mediumResPresignedUrl,
                  type: "video/mp4",
                  width: 1280,
                  height: 720,
                },
                {
                  src: lowResPresignedUrl,
                  type: "video/mp4",
                  width: 853,
                  height: 480,
                },
                {
                  src: ultraLowResPresignedUrl,
                  type: "video/mp4",
                  width: 640,
                  height: 360,
                },
              ]}
            >
              <MediaProvider />
            </MediaPlayer>
          ) : (
            <Text>Loading video...</Text>
          )}
        </Flex>


        <Flex
          justifyContent={"space-between"}
          alignItems={"center"}
          width={"100%"}
        >
          <Flex justifyContent={"flex-start"}>
            <Link to={"/profile/" + (user.signInDetails?.loginId ?? "")}>
              <Button
                id={"upload-user"}
                type={"button"}
                className="uploadUser-btn"
              >
                {uploader}
              </Button>
            </Link>
          </Flex>
          

          <Flex gap={"10px"}>
            {tags.map((tag) => (
              <Button type={"button"} key={tag} className="tag-btn">
                {tag}
              </Button>
            ))}
          </Flex>
        </Flex>
        <Text fontSize={"1rem"} lineHeight={"1.4"}>
          {description}
        </Text>
        <Menu
          trigger={
          <MenuButton variation='primary' size="small" width="20%">
            Resolution
          </MenuButton>
          }
        >
        <MenuItem onClick={() => (highResPresignedUrl)}>High Resolution</MenuItem>
        <MenuItem onClick={() => (mediumResPresignedUrl)}>Medium Resolution</MenuItem>
        <MenuItem onClick={() => (lowResPresignedUrl)}>Low Resolution</MenuItem>
      </Menu>
      </Flex>
    </View>
  );
}

export default PlaybackPage;
