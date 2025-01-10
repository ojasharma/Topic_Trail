const {
  generateStructuredSummary,
} = require("./HuggingFaceService");

// Test text - to be replaced with your input
const testText = `   
Translation, it's done with a Transformer StatQuest. Hello, I'm Josh Starmer and welcome to StatQuest. Today we're going to talk about Transformer Neural Networks, and they're going to be clearly explained. Transformers are more fun when you build them in the cloud with lightning. Bam. Right now, people are going bonkers about something called ChatGPT. For example, our friend, Statsquatch, might type something into ChatGPT like Write an awesome song in the style of StatQuest. Translation, 
it's done with a transform-er. Anyway, there's a lot to be said about how ChatGPT works, but fundamentally, it is based on something called a transformer. So, in this stat quest, we're going to show you how a transformer works one step at a time. 
Specifically, we're going to focus on how a transformer neural network can translate a simple English sentence, Let's go, into Spanish. Vamos. Now, since a transformer is a type of neural network, and neural networks usually only have numbers for 
input values, the first thing we need to do is find a way to turn the input and output words into numbers. There are a lot of ways to convert words into numbers, but for neural networks, one of the most commonly used methods is called word embedding. The main idea of word embedding is to use a relatively simple neural network. that has one input for every word and symbol in the vocabulary that you want to use. In this case, we have a super simple vocabulary that allows us to input short phrases like let's go and to go. And we have an input for this symbol, EOS, which stands for end of sentence or end of sequence. Because the vocabulary can be a mix of words, word fragments, and symbols, we call each input a token. The inputs are then connected to something called an activation function, and in this example, we have two activation functions. And each connection multiplies the input value by something called a weight. Hey Josh, where do these numbers come from? Great question, Squatch, and we'll answer it in just a bit. For now, let's just see how we convert the word let's into numbers. First, we put a 1 into the input for let's, and then put zeros into all of the other inputs. Now we multiply the inputs by their weights on the connections to the activation functions. For example, the input for let's is 1, so we multiply 1.87 by 1 to get 1.87 going to activation function on the left, and we multiply 0.09 by 1 to get 0.09 going to the activation function on the right. In contrast, if the input value for the word 2 is 0, then we multiply negative 1.45 by 0 to get 0 going to the activation function on the left. And we multiply 1.50 by 0 to get 0 going to the activation function on the right. In other words, when an input value is 0, then it only sends 0s to the activation functions. And that means 2, go, and the EOS symbol all just send 0s to the activation functions. And only the weight values for let's end up at the activation functions because 
its input value is 1. So, in this case, 1.87 goes to the activation function on the left, and 0.09 goes to the activation function on the right. In this example, the activation functions themselves are just identity functions, meaning the output values are the same as the input values. In other words, if the input value, or X-axis coordinate for the activation function on the left is 1.87, then the output value, the Y-axis coordinate, will also be 1.87. Likewise, because the input to the activation function on the right is 0.09, the output is also 0.09. Thus, these output values 1.87 and 0.09 are the numbers that represent the word let's. Bam! Likewise, if we want to convert the word go into numbers, we set the input value for go to 1, and all of the other inputs to 0. And we end up with negative 0.78 and 0.27 as the numbers that represent the word go. And that is how we use word embedding to convert our input phrase, let's go, into numbers. Bam! Note, there's a lot more to say about word embedding, so if you're interested, check out the quest. Also note, before we move on, I want to point out two things. First, we reuse the same word embedding network for each input word or symbol. In other words, the weights in the network for lets are the exact same as the weights in the network for go. This means that regardless of how long the input sentence is, we just copy and use the exact same word embedding network for each word or symbol. And this gives us flexibility to handle input sentences with different lengths. The second thing I want to mention is that all of these weights, and all of the other weights we're going to talk about in this quest, are determined using something called backpropagation. To get a sense of what backpropagation does, let's imagine we had this data, and we wanted to fit a line to it. Backpropagation would start with a line that has a random value for the y-axis intercept, and a random value for the slope, and then, using an iterative process, backpropagation would change the y-axis intercept and slope one step at a time until it found the optimal values. Likewise, in the context of neural networks, each weight starts out as a random number. But when we train the transformer with English phrases and known Spanish translations, backpropagation optimizes these values one. one step at a time and results in these final weights. Also, just to be clear, the process of optimizing the weights is also called training. Bam. Note, there is a lot more to be said about training and backpropagation, so if you're interested, check out the quests. Now, because the word embedding networks are taking up the whole screen, let's shrink them down and put them in the 
corner. Okay, now that we know how to convert words into numbers, let's talk about word order. For example, if Norm said, Squatch eats pizza, then Squatch might say, Yum! In contrast, if Norm said, Pizza eats Squatch, then Squatch might say, Yikes! So these two phrases, Squatch eats pizza, and pizza eats squash use the exact same words but have very different meanings. So, keeping track of word order is super important. So let's talk about positional encoding, which is a technique that transformers use to keep track of word order. We'll start by showing how to add positional encoding to the first phrase, Squatch eats pizza. Note, there are a bunch of ways to do positional encoding, but we're just going to talk about one popular method. That said, the first thing we do is convert the words Squatch Eats Pizza into numbers using word embedding. In this example, we've got a new vocabulary and we're creating four word embedding values per word. However, in practice, people often create hundreds or even thousands of embedding values per word. Now we add a set of numbers that correspond to word order to the embedding values for each word. Hey Josh, where do the numbers that correspond to word order come from? In this case, the numbers that represent the word order come from a sequence of alternating sine and cosine squiggles. Each squiggle gives us specific position values for each word's embeddings. For example, the y-axis values on the green squiggle give us position encoding values for the first embeddings for each word. Specifically, for the first word, which has an x-axis coordinate all the way to the left of the green squiggle, the position value for the first embedding is the y-axis coordinate, 0. The position value for the second embedding comes from the orange squiggle, and the y-axis coordinate on the orange squiggle that corresponds to the first word is 1. Likewise, the blue squiggle, which is more spread out than the first two squiggles, gives us the position value for the third embedding value, which for the first word is zero. Lastly, the red squiggle gives us the position value for the fourth embedding, which for the first word is one. Thus, the position values for the first word come from the corresponding y-axis coordinates on the squiggles. Now, to get the position values for the second word, we simply use the y-axis coordinates on the squiggles that correspond to the x-axis coordinate for the second word. Lastly, to get the position values For the third word, we use the y-axis coordinates on the squiggles that correspond to the x-axis coordinate for the third word. Note, because the sine and cosine squiggles are repetitive, it's possible that two words might get the same position or y-axis values. For example, the second and third words both got negative 0.9 for the first position value. However, because the squiggles get wider for larger embedding positions, and the more embedding values we have than the wider the squiggles get, then, even with a repeat value here and there, we end up with a unique sequence of position values for each word. Thus, each input word ends up with a unique sequence of position values. Now all we have to do is add the position values to the embedding values, and we end up with the word embeddings plus positional encoding for the whole sentence, Squatch eats pizza. Yum! Note, if we reverse the order of the input words to be Pizza eats Squatch, then the embeddings for the first and third words get swapped, but the positional values for the first, second, and third word stay the same. And when we add the positional values to the embeddings, We end up with new positional encoding for the first and third words. And the second word, since it didn't move, stays the same. Thus, positional encoding allows a transformer to keep track of word order. Bam! Now let's go back to our simple example, where we are just trying to translate the English sentence, let's go, and add position values to the word embeddings. The first embedding for the first word, let's, gets 0. And the second embedding gets 1. And the first embedding for the second word, go, gets negative 0.9. And the second embedding gets 
0.4. Now we just do the math to get the positional encoding for both words. Bam! Now, because we're going to need all the space we can get, let's consolidate the math in the diagram. and let the sine and cosine and plus symbols represent the positional encoding. Now that we know how to keep track of each word's position, let's talk about how a transformer keeps track of the relationships among words. For example, if the input sentence was this, The pizza came out of the oven and it tasted 
good. Then this word, it, could refer to pizza or, potentially, it could refer to the word oven. Josh, I've heard of good-tasting pizza, but never a good-tasting oven. I know, Squatch. That's why it's important that the transformer correctly associates the word it with pizza. The good news is that transformers have something called self-attention, which is a mechanism to correctly associate the word it with the word pizza. In general terms, self-attention works by seeing how similar each word is to all of the words in the sentence, including itself. For example, self-attention calculates the similarity between the first word, the, and all of the words in the sentence. including itself. And self-attention calculates these similarities for every word in the sentence. Once the similarities are calculated, they are used to determine how the transformer encodes each word. For example, if you looked at a lot of sentences about pizza and the word it was more commonly associated with pizza than oven, then the similarity score for pizza will cause it to have a larger impact on how the word it is encoded by the transformer. Bam. Now that we know the main ideas of how self-attention works, let's look at the details. So let's go back to our simple example where we had just added positional encoding to the words lets and go. The first thing we do is multiply the position encoded values for the word lets by a pair of weights. And we add those products together to get negative 1.0. Then we do the same thing with a different pair of weights, to get 3.7. We do this twice because we started out with two position-encoded values that represent the word let's. And, after doing the math two times, we still have two values representing the word let's. Josh, I don't get it. If we want two values to represent let's, why don't we just use the two values we started with? That's a great question, Squatch, and we'll answer it in a little bit. Grrr. Anyway, for now, just 
know that we have these two new values to represent the word let's, and in transformer terminology, we call them query values. And now that we have query values for the word let's, let's use them to calculate the similarity between itself and the 
word go. And we do this by creating two new values, just like we did for the query to represent the word let's. And we create two new values to represent the word go. Both sets of new values are called key values. And we use them to calculate similarities with the query for let's. One way to calculate similarities between the query and the keys is to calculate something called a dot product. For example, in order to calculate the dot product similarity between the query and key for let's, 
we simply multiply each pair of numbers together, and then add the products to get 11.7. Likewise, we can calculate the dot product similarity between the query for let's and the key for go, by multiplying the pairs of numbers together, and adding the products to get negative 2.6. The relatively large similarity value for let's relative to itself, 11.7, compared to the relatively small value for let's relative to the word go, negative 2.6, tells us that let's is much more similar to itself than it is to the word go. That said, if you remember the example where the word it could relate to pizza or oven, The word it should have a relatively large similarity value with respect to the word pizza, since it refers to pizza and not oven. 
Note, there's a lot to be said about calculating similarities in this context and the dot product, so if you're interested, check out the quests. Anyway, since let's is much more similar to itself than it is to the word go, then we want let's to have more influence on its encoding than the word go. And we do this by first running the similarity scores through something called a softmax function. The main idea of a softmax function is that it preserves the order of the input values from low to high and translates them into numbers between 0 and 1 that add up to 1. So we can think of the output of the softmax function as a way to determine what percentage of each input word we should use to encode the word lets. In this case, because lets is so much more similar to itself than the word go, we'll use 100% of the word lets to encode lets, and 0% of the word go to encode the word lets. Note, there's a lot more to be said about the softmax function, so if you're interested, check out the quest. Anyway, because we want 100% of the word lets to encode lets, we create two more values that we'll cleverly call values to represent the word lets, and scale the values that represent lets by 1.0. Then we create two values to represent the word go and scale those values by 0.0. Lastly, we add the scaled values together. And these sums, which combine separate encodings for both input words, let's and go, relative to their similarity to let's, are the self-attention values for let's. Bam! Now that we have self-attention values for the word let's, it's time to calculate them for the word go. The good news is that is that we don't need to recalculate the keys and values. Instead, all we need to do is create the query that represents the word go. And do the math. By first calculating the similarity scores between the new query and the keys, and then run the similarity scores through a softmax, and then scale the values, and then add them together. And we end up with the self-attention values for go. Before we move on, I want to point out a few details about self-attention. First, the weights that we use to calculate the self-attention queries are the exact same for lets and go. In other words, this example uses one set of weights for calculating self-attention queries, regardless of how many words are in the input. Likewise, we reuse the sets of weights for calculating self-attention keys and values for each input word. This means that no matter how many words are input into the transformer, we just reuse the same sets of weights for self-attention queries, keys, and values. The other thing I want to point out is that we can calculate the queries, keys, and values for each word at the same time. time. In other words, we don't have to calculate the query, key, and value for the first word first before moving on to the second word. And because we can do all of the computation at the same time, transformers can take advantage of parallel computing and run fast. Now that we understand the details of how self-attention works, let's shrink it down so we can keep building our transformer. Bam? Josh, you forgot something! If we want two values to represent let's, why don't we just 
use the two position encoded values we started with? First, the new self-attention values for each word contain input from all of the other words, and this helps give each word context. and this can help establish how each word in the input is related to the others. Also, if we think of this unit with its weights for calculating queries, keys, and values as a self-attentioned cell, then, in order to correctly establish how words are related in complicated sentences and paragraphs, we can create a stack of self-attention cells, each with its own sets of weights, that we apply to the position-encoded values for each word, to capture different relationships among the words. In the manuscript that first described transformers, they stacked eight self-attention cells, and they called this multi-head attention. Why eight instead of twelve or sixteen? I have no idea. Bam! Okay, going back to our simple example with only one self-attention cell, there's one more thing we need to do to encode the input. We take the position encoded values and add them to the self-attention values. These bypasses are called residual connections, and they make it easier to train complex neural networks. by allowing the self-attention layer to 
establish relationships among the input words without having to also preserve the word embedding and position encoding information. Bam! And that's all we need to do to encode the input for this simple transformer. Double bam! Note, this simple transformer only contains the parts required for encoding the input. word embedding, positional encoding, self-attention, and residual connections. These four features allow the transformer to encode words into numbers, encode the positions of the words, encode the relationships among the words, and relatively easily and quickly train in parallel. That said, there are lots of extra things we can add to a transformer, and we'll talk about those at the end of this quest. Bam. So, now that we've encoded the English input phrase, let's go, it's time to decode it into Spanish. In other words, the first part of a transformer is called an encoder. And now it's time to create the second part, a decoder. The decoder, just like the encoder, starts with word embedding. However, this time we create embedding values for the output vocabulary, which consists of the Spanish words, IR, VAMOS, E, and the EOS end-of-sequence token. Now, because we just finished encoding the English sentence, let's go, the decoder starts with embedding values for the EOS token. In this case, we're using the EOS token to start the decoding because that is a common way to... initialize the process of decoding the encoded input sentence. However, sometimes you'll see people use SOS for start of sentence or start of sequence to initialize the process. Josh, starting with SOS makes more sense to me. Then you can do it that way, Squatch. I'm just saying, a lot of people start with EOS. Anyway, we plug in 1 for EOS and 0 for everything else. and do the math, and we end up with 2.70 and negative 1.34 as the numbers that represent the EOS token. Bam. Now let's shrink the word embedding down to make more space, so that we can add the positional encoding. Note, these are the exact same sine and cosine squiggles that we used when we encoded the input. And since the EOS token is in the first position with two embeddings, we just add those two position values. And we get 2.70 and negative 0.34 as the position and word embedding values representing the EOS token. Bam. Now let's consolidate the math in the diagram. And before we move on to the next step, let's review a key concept from when we encoded the input. One key concept from earlier was that we created a single unit to process an input word. And then we just copied that unit for each word in the input. And if we had more words, we just make more copies of the same unit. By creating a single unit that can be copied for each input word, the transformer can do all of the computation for each word in the input at the same time. For example, we can calculate the word embeddings on different processors at the same time, and then add the positional encoding at the same time, and then calculate the queries, keys, and values at the same time. And once that is done, we can calculate the self-attention values at the same time. And lastly, we can calculate the residual connections at the same time. Doing all of the computations at the same time rather than doing them sequentially for each word means we can process a lot of words relatively quickly on a chip with a lot of computing cores, like a GPU, graphics processing unit, or multiple chips in the cloud. Well, likewise, when we decode and translate the input, we want a single unit that we can copy for each translated word for the same reasons. We want to do the math quickly. So, even though we're only processing the EOS token so far, we add a self-attention layer so that, ultimately, we can keep track of related words in the output. Now that we have the query, key, and value numbers for the EOS token, we calculate its self-attention values just like before. And the self-attention values for the EOS token are negative 2.8 and negative 2.3. Note, the sets of weights we used to calculate the decoder's self-attention, query, key, and value are different from the sets we used in the encoder. Now let's consolidate the math and add residual 
connections just like before. Bam! Now, so far we've talked about how self-attention helps the transformer keep track of how words are related within a sentence. However, since we're translating a sentence, we also need to keep track of the relationships between the input sentence and the output. For example, if the input sentence was, Then, when translating, it's super important to keep track of the very first word, don't. If the translation focuses on other parts of the sentence and omits the don't, then we'll end up with, And these two sentences have completely opposite meanings. So it's super important for the decoder to keep track of the significant words in the input. So the main idea of encoder-decoder attention is to allow 
the decoder to keep track of the significant words in the input. Now that we know the main idea behind encoder-decoder attention, here are the details. First, to give us a little more room, let's consolidate the math and the diagrams. Now, just like we did for self-attention, we create two new values to represent the query for the EOS token in the decoder. Then we create keys for each word in the encoder, and we calculate the similarities between the EOS token in the decoder and each word 
in the encoder by calculating the dot products just like before. Then we run the similarities through a softmax function, and this tells us to use 100% of the first input word and 0% of the second when the decoder determines what should be the first translated word. Now that we know what percentage of each input word to use when determining what should be the first translated word, we calculate values for each input word, and then scale those values by the softmax percentages. And then add the pairs of scaled values together to get the encoder-decoder attention values. Bam! Now, to make room for the next step, let's consolidate the encoder-decoder attention in our diagram. Note, the sets of weights that we use to calculate the queries, keys, and values for encoder-decoder attention are different from the sets of weights we use for self-attention. However, just like for self-attention, the sets of weights are copied and reused for each word. This allows the transformer to be flexible with the length of the inputs and outputs. And also, we can stack encoder-decoder attention just like we can stack self-attention to keep track of words and complicated phrases. Bam. Now we add another set of residual connections that allow the encoder-decoder attention to focus on the relationships between the output words and the input words without having to preserve the self-attention or word and position encoding that happened earlier. Then we consolidate the math in the diagram. Lastly, we need a way to take these two values that represent the EOS token in the decoder and select one of the... four output tokens, IR, VAMOS, E, or EOS. So we run these two values through a fully connected layer that has one input for each value that represents the current token. So in this case, we have two inputs. And one output for each token in the output vocabulary, which in this case means four outputs. Note, a fully connected layer is just a simple neural network with weights, numbers we multiply the inputs by, And biases, numbers we add to the sums of the products. And when we do the math, we get four output values, which we run through a final softmax function to select the first output word, vamos. Bam. Note, vamos is the Spanish translation for let's go. Triple bam? No, not yet. So far, the translation is correct, but the decoder doesn't stop until it outputs an EOS token. So let's consolidate our diagrams and plug the translated word, Vamos, into a copy of the decoder's embedding layer and do the math. First, we get the word embeddings for Vamos. Then we add the positional encoding. Now we calculate self-attention values for Vamos using the exact same weights that we used for the EOS token. Now add the residual connections and calculate the encoder-decoder attention using the same sets of weights that we used for the EOS token. Now we add more residual connections. Lastly, we run the values that represent Vamos through the same fully connected layer and softmax that we used for the EOS token. And the second output from the decoder is EOS, so we are done decoding. Triple bam! At long last, we've shown how a transformer can encode a simple input phrase, let's go, and decode the encoding into the translated phrase, vamos. In summary, transformers use word embedding to convert words into numbers, positional encoding to keep track of word order, self-attention to keep track of word relationships within the input and output phrases, encoder-decoder attention to keep track of things between the input and output phrases to make sure that important words in the input are not lost in the translation, and residual connections to allow each subunit, like self-attention, to 
focus on solving just one part of the problem. Now that we understand the main ideas of how transformers work, let's talk about a few extra things we can add to them. In this example, we kept things super simple. However, if we had larger vocabularies, and the original transformer had 37,000 tokens and longer input and output phrases, then, in order to get their model to work, they had to normalize the values after every step. For example, they normalized the values after positional encoding and after self-attention in both the encoder and the decoder. Also, when we calculated attention values, we used the dot product to calculate the similarities, but you can use whatever similarity function you want. In the original transformer manuscript, they calculated the similarities with the dot product divided by the square root of the number of embedding values per token. Just like with scaling the values after each step, they found that scaling the dot product helped encode and decode long and complicated phrases. Lastly, to give a transformer more weights and biases to fit to complicated data, you can add additional neural networks with hidden layers to both the encoder and decoder. Bam. Now it's time for some... Shameless self-promotion. If you want to review statistics and machine learning offline, check out the StatQuest PDF study guides and my book, The StatQuest Illustrated Guide to Machine Learning, at statquest.org. There's something for everyone. Hooray! 
We've made it to the end of another exciting StatQuest. If you like this StatQuest and want to see more, please subscribe. And if you want to support StatQuest, consider contributing to my Patreon campaign, becoming a channel member, buying one or two of my original songs, or a t-shirt, or a hoodie, or just donate. The links are in the description below. Alright, until next time, quest on!


`;

// Sample summary array format for direct MCQ testing
const sampleSummaryArray = [
  {
    title: "Introduction to Computer Science",
    content:
      "The instructor says that computer science is the study of computation, automation, and information.",
  },
  {
    title: "Basic Programming Concepts",
    content:
      "The instructor says that programming involves writing instructions for computers to follow.",
  },
];

async function validateEnvironment() {
  console.log("🔍 Validating environment setup...");

  if (!process.env.GROQ_API_KEY) {
    console.error("❌ Error: GROQ_API_KEY environment variable is not set");
    throw new Error("Missing GROQ_API_KEY");
  }

  console.log("✅ Environment validation successful!");
}

async function testStructuredSummary() {
  console.log("\n🚀 Test 1: Generating Structured Summary");
  console.log("----------------------------------------");

  try {
    console.log("📝 Processing text input...");
    const summary = await generateStructuredSummary(testText);

    console.log("✅ Summary generated successfully!");
    console.log("📊 Generated Topics:", summary.length);

    // Log each topic briefly
    summary.forEach((topic, index) => {
      console.log(`\n📌 Topic ${index + 1}: ${topic.title}`);
      console.log(`   Summary length: ${topic.content.length} characters`);
    });

    console.log("\n📋 Full Summary Structure:");
    console.log(JSON.stringify(summary, null, 2));

    return summary;
  } catch (error) {
    console.error("❌ Summary Generation Failed:", error.message);
    console.error("📋 Full error:", error);
    throw error;
  }
}

async function testMCQGeneration(summaryArray = null) {
  console.log("\n🎯 Test 2: Generating MCQs");
  console.log("----------------------------------------");

  try {
    const inputSummary = summaryArray || sampleSummaryArray;

    console.log(`📝 Generating MCQs for ${inputSummary.length} topics...`);

    // Log topics being processed
    inputSummary.forEach((topic, index) => {
      console.log(`\n📌 Processing Topic ${index + 1}: ${topic.title}`);
    });

    const mcqs = await generateMCQs(inputSummary);

    console.log("\n✅ MCQs generated successfully!");
    console.log(`📊 Total MCQs generated: ${mcqs.length}`);

    // Log MCQ statistics
    mcqs.forEach((mcq, index) => {
      console.log(`\n❓ Question ${index + 1}:`);
      console.log(`   Topic: ${mcq.topic}`);
      console.log(`   Options: ${mcq.options.length}`);
      console.log(
        `   Explanation length: ${mcq.explanation.length} characters`
      );
    });

    console.log("\n📋 Full MCQs Structure:");
    console.log(JSON.stringify(mcqs, null, 2));

    return mcqs;
  } catch (error) {
    console.error("❌ MCQ Generation Failed:", error.message);
    console.error("📋 Full error:", error);
    throw error;
  }
}

async function runTests() {
  console.log("🎮 Starting Groq API Test Suite...\n");

  try {
    // Step 1: Validate environment
    await validateEnvironment();

    // Step 2: Test Summary Generation
    const summary = await testStructuredSummary();

    // Step 3: Test MCQ Generation with generated summary
    await testMCQGeneration(summary);

    console.log("\n🎉 All tests completed successfully!");
  } catch (error) {
    console.error("\n❌ Test Suite Failed:", error.message);
    process.exit(1);
  }
}

// Run individual tests
async function runSummaryTest() {
  console.log("🎮 Running Summary Generation Test Only...\n");
  try {
    await validateEnvironment();
    await testStructuredSummary();
    console.log("\n🎉 Summary test completed successfully!");
  } catch (error) {
    console.error("\n❌ Summary Test Failed:", error.message);
    process.exit(1);
  }
}

async function runMCQTest(summaryArray = null) {
  console.log("🎮 Running MCQ Generation Test Only...\n");
  try {
    await validateEnvironment();
    await testMCQGeneration(summaryArray);
    console.log("\n🎉 MCQ test completed successfully!");
  } catch (error) {
    console.error("\n❌ MCQ Test Failed:", error.message);
    process.exit(1);
  }
}

// Export all test functions for flexibility
module.exports = {
  runTests,
  runSummaryTest,
  runMCQTest,
  testStructuredSummary,
  testMCQGeneration,
};

// Run the full test suite if this file is executed directly
if (require.main === module) {
  runTests()
    .then(() => {
      console.log("\n👋 Test suite execution completed!");
    })
    .catch((error) => {
      console.error("\n💥 Test suite execution failed:", error);
      process.exit(1);
    });
}
