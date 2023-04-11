# Bluedom
### Improve employee engagement with Bluedom!

## Features:
- Web API for managing all relevant data accessible to the user
- React + Bootstrap application for user interaction
- Simple authentification of the users
- Storing persistent user data / progress
- Completion of quests via a simple 'Type Racer' minigame
- Leaderboard for competitive spirit
- A shop to customize minigame experience

## Overview
- Users visiting the web application are greeted with a login screen, where they can register or log in if they already have an account
- Once logged in, they can accept or propose quests on the homescreen
- Creating a new quest consumes tokens equal to the reward of that quest
- If someone completes the quest, the quest issuer gets two times the reward
- Each quest can be completed once, except for the ones issued by 'the house'
- Attempting a quest shows a settings screen, where players can select a specific Background, Font or Text effect from their inventory
- Users can buy these items from the shop
- Once the settings are confirmed, the minigame starts
- In the minigame, users have to type in the quest text in the allotted time
- On success, they win the rewards, on failure, they can try again, assuming the quest is still up

## Installation & setup
- For the backend, please refer to [the backend docs](backend-docs.md)
- For the frontend, please refer to [the frontend docs](frontend-docs.md)