import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { supabaseClient } from "../lib/client";

const Profile = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const [avatarurl, setAvatarurl] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploadLoading, setIsImageUploadLoading] = useState(false);

  const user = supabaseClient.auth.user();

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .then(({ data, error }) => {
          if (!error) {
            setUsername(data[0].username || "");
            setWebsite(data[0].website || "");
            setBio(data[0].bio || "");
            setAvatarurl(data[0].avatarurl || "");
          }
        });
    }
  }, [user]);

  const updateHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const body = { username, website, bio };
    const userId = user.id;
    const { error } = await supabaseClient
      .from("profiles")
      .update(body)
      .eq("id", userId);
    if (!error) {
      setUsername(body.username);
      setWebsite(body.website);
      setBio(body.bio);
    }
    setIsLoading(false);
  };

  function makeid(length) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const uploadHandler = async (event) => {
    setIsImageUploadLoading(true);
    const avatarFile = event.target.files[0];
    const fileName = makeid(10);

    const { error } = await supabaseClient.storage
      .from("avatars")
      .upload(fileName, avatarFile, {
        cacheControl: "3600",
        upsert: false,
      });
    if (error) {
      setIsImageUploadLoading(false);
      console.log("error", error);
      return;
    }
    const { publicURL, error: publicURLError } = supabaseClient.storage
      .from("avatars")
      .getPublicUrl(fileName);
    if (publicURLError) {
      setIsImageUploadLoading(false);
      console.log("publicURLError", publicURLError);
      return;
    }
    const userId = user.id;
    await supabaseClient
      .from("profiles")
      .update({
        avatarurl: publicURL,
      })
      .eq("id", userId);
    setAvatarurl(publicURL);
    setIsImageUploadLoading(false);
  };

  return (
    <Box>
      <Navbar />
      <Box mt="8" maxW="xl" mx="auto">
        <Flex align="center" justify="center" direction="column">
          <Avatar
            size="2xl"
            src={avatarurl || ""}
            name={username || user?.email}
          />
          <FormLabel
            htmlFor="file-input"
            my="5"
            borderRadius="2xl"
            borderWidth="1px"
            textAlign="center"
            p="2"
            bg="blue.400"
            color="white"
          >
            {isImageUploadLoading ? "Uploading....." : "Upload Profile Picture"}
          </FormLabel>
          <Input
            type="file"
            hidden
            id="file-input"
            onChange={uploadHandler}
            multiple={false}
            disabled={isImageUploadLoading}
          />
        </Flex>
        <Stack
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          p={5}
          mt="-2"
          spacing="4"
          as="form"
          onSubmit={updateHandler}
        >
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" isDisabled={true} value={email} />
          </FormControl>
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              placeholder="Add your username here"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </FormControl>
          <FormControl id="website" isRequired>
            <FormLabel>Website URL</FormLabel>
            <Input
              placeholder="Add your website here"
              type="url"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
            />
          </FormControl>
          <FormControl id="bio" isRequired>
            <FormLabel>Bio</FormLabel>
            <Textarea
              placeholder="Add your bio here"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
            />
          </FormControl>
          <Button colorScheme="blue" type="submit" isLoading={isLoading}>
            Update
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Profile;
