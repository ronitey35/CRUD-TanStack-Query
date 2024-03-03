import {
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Spinner,
  Stack,
  Text,
  Toast,
  grid,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const fetchPosts = async (id) => {
  try {
    const { data } = await axios.get(
      `https://gorest.co.in/public/v2/posts?page=${id}`
    );
    return data;
  } catch (error) {
    throw Error("Unable to fetch Post");
  }
};

const Home = () => {
  const toast = useToast();
  const { id } = useParams();
  const pageID = parseInt(id);
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["posts", pageID],
    queryFn: () => fetchPosts(pageID),
    config: {
      keepPreviousData: true,
      onSuccess: () => {
        toast({
          status: "success",
          title: "Success",
          description: "Data fetched successfully",
          duration: 3000,
          isClosable: true,
        });
      },
      onError: () => {
        toast({
          status: "error",
          title: "Error",
          description: "Failed to fetch data",
          duration: 3000,
          isClosable: true,
        });
      },
    },
  });

  console.log(id);
  return (
    <Container maxW="1300px" mt="4">
      {isLoading ? (
        <Grid placeItems="center " height="100vh">
          <Spinner />
        </Grid>
      ) : (
        <>
          <Flex justify="space-between" mb="4">
            <Button
              colorScheme="red"
              onClick={() => {
                navigate(`/${pageID - 1}`);
              }}
              disabled={false}
            >
              prev
            </Button>
            <Button
              colorScheme="green"
              onClick={() => {
                navigate(`/${pageID + 1}`);
              }}
            >
              next
            </Button>
          </Flex>
          {data?.map((post) => (
            <Stack
              p="4"
              boxShadow="medium"
              borderRadius="xl"
              border="1px solid #ccc"
            >
              <Flex justify="space-between">
                <Text>UserID:{post.user_id}</Text>
                <Text>PostID:{post.id}</Text>
              </Flex>
              <Heading>Title:{post.title}</Heading>
              <Text>Desctiption:{post.title}</Text>
            </Stack>
          ))}
        </>
      )}
    </Container>
  );
};

export default Home;
