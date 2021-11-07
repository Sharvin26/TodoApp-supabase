import {
  Box,
  Divider,
  Heading,
  Tag,
  Text,
  Button,
  Center,
} from "@chakra-ui/react";

const SingleTodo = ({ todo, openHandler, deleteHandler, isDeleteLoading }) => {
  const getDateInMonthDayYear = (date) => {
    const d = new Date(date);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const n = d.toLocaleDateString("en-US", options);
    const replase = n.replace(new RegExp(",", "g"), " ");
    return replase;
  };

  return (
    <Box
      position="relative"
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p="4"
      onClick={() => openHandler(todo)}
    >
      <Heading size="md" mt="3">
        {todo.title}
      </Heading>
      <Tag
        position="absolute"
        top="3"
        right="2"
        bg={todo.isComplete ? "green.500" : "yellow.400"}
        borderRadius="3xl"
        size="sm"
      />
      <Text color="gray.400" mt="1" fontSize="sm">
        {getDateInMonthDayYear(todo.insertedat)}
      </Text>
      <Divider my="4" />
      <Text noOfLines={[1, 2, 3]} color="gray.800">
        {todo.description}
      </Text>
      <Center>
        <Button
          mt="4"
          size="sm"
          colorScheme="red"
          onClick={(event) => {
            event.stopPropagation();
            deleteHandler(todo.id);
          }}
          isDisabled={isDeleteLoading}
        >
          Delete
        </Button>
      </Center>
    </Box>
  );
};

export default SingleTodo;
