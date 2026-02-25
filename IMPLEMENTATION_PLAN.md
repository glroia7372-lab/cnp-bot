# Bot App Menu Structure Implementation Plan

## Overview
Reconstructing the bot application menu into 4 primary sections as requested by the user: Home (Chat), Work, Library, and My.

## Menu Structure Details
1.  **홈 (Home/Chat)**
    *   **Features**: Interactive Chat UI, Quick Menu (FAQs), Voice Recognition Button.
    *   **Design**: Modern chat interface with quick action bubbles.

2.  **워크 (Work)**
    *   **Features**: FlipPass Real-time Status, Event Schedule dashboard, Equipment Rental Request form.
    *   **Design**: Data-rich dashboard with real-time indicators and cards.

3.  **라이브러리 (Library)**
    *   **Features**: FlipPass Manual PDF viewer, Internal Regulations access, Notice Archive search.
    *   **Design**: Document-centric layout with search and filter capabilities.

4.  **마이 (My)**
    *   **Features**: Annual Leave status, Financial Settlement history, Personal Equipment Rental list, App Settings.
    *   **Design**: User profile summary and list-based management interface.

## UI/UX Enhancements
*   **Navigation**: Implement a premium bottom navigation bar (common in mobile bot apps) or a sleek desktop sidebar.
*   **Aesthetics**: Glassmorphism effects, fluid transitions using `framer-motion`, and a dark-mode first premium palette using **#D95204** as the primary point color.
*   **Typography**: Use Inter/Geist for a modern tech feel.

## Technical Tasks
1.  **Tab State Management**: Use `useState` to manage active tabs.
2.  **Component Modularization**: Create dedicated components for each tab's view.
3.  **Animation**: Use `AnimatePresence` for smooth switching between menus.
4.  **Mobile Responsiveness**: Ensure the layout works perfectly on mobile screens where bot apps are frequently used.
