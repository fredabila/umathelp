import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Alert, Text, Switch, StyleSheet } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { v4 as uuidv4 } from "uuid";

const ChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState("");
    const [showTypingLoader, setShowTypingLoader] = useState(false);


    const renderChatbotBubble = props => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    left: { backgroundColor: "green" },
                    right: { backgroundColor: "white" }
                }}
                textStyle={{
                    left: { color: "white" },
                    right: { color: "black" }
                }}
            />
        );
    };

    const renderUserBubble = props => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    left: {
                        backgroundColor: "#E7E7E7"
                    },
                    right: {
                        backgroundColor: "#3777F0"
                    }
                }}
                textStyle={{
                    left: {
                        color: "#000000"
                    },
                    right: {
                        color: "#FFFFFF"
                    }
                }}
            />
        );
    };



    const onSend = async (newMessages = []) => {
        const text = newMessages[0].text;
        const context = chatHistory;

        // Display the user message before making the API call
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, [
                {
                    _id: uuidv4(),
                    text: text,
                    createdAt: new Date(),
                    user: {
                        _id: 1,
                        avatar:
                            "https://cdn.dribbble.com/users/1077075/screenshots/10945047/media/70cd58ac294ac9e45e55913702df2472.png?compress=1&resize=400x300&vertical=top"
                    }
                }
            ])
        );

        try {
            setMessages((previousMessages) =>
                GiftedChat.append(previousMessages, [
                    {
                        _id: uuidv4(),
                        text: "",
                        user: {
                            _id: 2,
                            name: "Chatbot",
                            avatar:
                                `https://conference.umat.edu.gh/wp-content/uploads/2018/01/UMaT-logo-238x300.jpg`,
                        },
                        typing: true, // Display typing indicator before the response
                    },
                ])
            );

            // Set showTypingLoader to true to display the typing loader
            setShowTypingLoader(true);
            const response = await fetch(
                process.env.EXPO_PUBLIC_BASE_URL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "api-key": process.env.EXPO_PUBLIC_API_KEY 
                    },
                    body: JSON.stringify({
                        dataSources: [
                            {
                                type: "AzureCognitiveSearch",
                                parameters: {
                                    endpoint: "https://buzzchat.search.windows.net",
                                    key: process.env.EXPO_PUBLIC_INDEX_API_KEY,
                                    indexName: 'umat-info-session'
                                }
                            }
                        ],
                        messages: [
                            { role: 'assistant', content: 'You are an assistant that will help guide UMAT (University of Mines and Technology) Students in accessing useful information to guide them throughout their journey' },
                            { role: 'assistant', content: 'You were built by a group of Computer Science and technology Students with the head of the project being Bright Ofori Kwarteng' },
                            { role: 'assistant', content: 'Your responses should sound almost natural and avoid stating the fact that you retrieve the data from a document.F' },
                            { role: 'user', content: context },
                            { role: 'user', content: '<sys>Do not include based on the retrieved documents in your responses</sys>' + text },
                        ],
                        temperature: 0,
                        max_tokens: 800,
                        top_p: 1,
                        frequency_penalty: 0,
                        presence_penalty: 0,
                        stop: null,
                        azureSearchEndpoint: 'https://buzzchat.search.windows.net',
                        azureSearchKey: process.env.EXPO_PUBLIC_INDEX_API_KEY,
                        azureSearchIndexName: 'umat-info-session'
                    })
                }
            );
            const data = await response.json();
            console.log(data.choices[0].message.context.messages);
            const reply = data.choices[0].message.content;
            setChatHistory(
                prevHistory => prevHistory + `{ role: 'user', content: ${text} }`
            );
            setChatHistory(
                prevHistory => prevHistory + `{ role: 'assistant', content: ${reply} }`
            );
            console.log(chatHistory);

            setShowTypingLoader(false);
            setMessages((previousMessages) =>
                GiftedChat.append(previousMessages, [
                    {
                        _id: uuidv4(),
                        text: reply,
                        createdAt: new Date(),
                        user: {
                            _id: 2,
                            name: "Chatbot",
                            avatar:
                                `https://conference.umat.edu.gh/wp-content/uploads/2018/01/UMaT-logo-238x300.jpg`,
                        },
                    },
                ])
            );

        } catch (error) {
            console.error("Error searching Google:", error);
            return null;
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ padding: 10 }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 10
                    }}
                >
                </View>
            </View>
            {loading ? (
                <ActivityIndicator />
            ) : (
                <GiftedChat
                    messages={messages}
                    onSend={newMessages => onSend(newMessages)}
                    user={{
                        _id: 1
                    }}
                    isTyping={showTypingLoader}
                    renderBubble={props => {
                        if (props.currentMessage.user._id === 1) {
                            return renderUserBubble(props);
                        } else {
                            return renderChatbotBubble(props);
                        }
                    }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF"
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#3777F0"
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF"
    }
});

export default ChatScreen;
