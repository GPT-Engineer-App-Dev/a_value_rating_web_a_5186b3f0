import { Box, Button, Container, Heading, Input, List, ListItem, Text, VStack } from "@chakra-ui/react";
import { FaArrowRight, FaCheck, FaSearch } from "react-icons/fa";
import { useState } from "react";

const valuesList = ["Honesty", "Integrity", "Courage", "Respect", "Responsibility", "Kindness", "Teamwork", "Creativity", "Diligence", "Empathy", "Freedom", "Justice", "Love", "Wisdom", "Humility"];

const Index = () => {
  const [stage, setStage] = useState(0);
  const [selectedValues, setSelectedValues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [matchups, setMatchups] = useState([]);
  const [results, setResults] = useState({});
  const [rankings, setRankings] = useState([]);

  const handleValueSelect = (value) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value));
    } else {
      setSelectedValues([...selectedValues, value].slice(0, 10));
    }
  };

  const startComparisons = () => {
    const pairs = [];
    for (let i = 0; i < selectedValues.length; i++) {
      for (let j = i + 1; j < selectedValues.length; j++) {
        pairs.push([selectedValues[i], selectedValues[j]]);
      }
    }
    setMatchups(pairs);
    setStage(2);
  };

  const handleComparisonResult = (winner, loser) => {
    setResults({
      ...results,
      [winner]: (results[winner] || 0) + 1,
      [loser]: results[loser] || 0,
    });
    matchups.shift();
    if (matchups.length === 0) {
      finishComparisons();
    } else {
      setMatchups([...matchups]);
    }
  };

  const finishComparisons = () => {
    const sortedValues = Object.keys(results).sort((a, b) => results[b] - results[a]);
    setRankings(sortedValues);
    setStage(3);
  };

  const filteredValues = valuesList.filter((value) => value.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Container maxW="container.md" py={10}>
      {stage === 0 && (
        <VStack spacing={4}>
          <Heading>Welcome to the Value Rating App</Heading>
          <Text>Discover and prioritize your core values by comparing them.</Text>
          <Button rightIcon={<FaArrowRight />} colorScheme="blue" onClick={() => setStage(1)}>
            Start Rating
          </Button>
        </VStack>
      )}

      {stage === 1 && (
        <VStack spacing={4}>
          <Input placeholder="Search values..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <List spacing={2}>
            {filteredValues.map((value) => (
              <ListItem key={value} p={2} bg={selectedValues.includes(value) ? "blue.100" : "gray.100"} onClick={() => handleValueSelect(value)}>
                {value} {selectedValues.includes(value) && <FaCheck />}
              </ListItem>
            ))}
          </List>
          <Button rightIcon={<FaArrowRight />} colorScheme="blue" isDisabled={selectedValues.length < 10} onClick={startComparisons}>
            Compare Values
          </Button>
        </VStack>
      )}

      {stage === 2 && matchups.length > 0 && (
        <Box>
          <Text>Which value is more important to you?</Text>
          <Button m={2} onClick={() => handleComparisonResult(matchups[0][0], matchups[0][1])}>
            {matchups[0][0]}
          </Button>
          <Button m={2} onClick={() => handleComparisonResult(matchups[0][1], matchups[0][0])}>
            {matchups[0][1]}
          </Button>
        </Box>
      )}

      {stage === 3 && (
        <VStack spacing={4}>
          <Heading>Your Values Ranked</Heading>
          <List spacing={2}>
            {rankings.map((value, index) => (
              <ListItem key={value} p={2} bg="blue.100">
                {index + 1}. {value}
              </ListItem>
            ))}
          </List>
        </VStack>
      )}
    </Container>
  );
};

export default Index;
