---
id: UI-ELEMENT-MAP-QUESTIONNAIRE
status: approved
phase: 6
---
# UI Element Map Questionnaire
> For each page in the APPROVED sitemap, specify how each content block is presented.
> This is the most reference-driven phase: cite a screenshot or link per block.
> Set status: answered when done, then run: bash scripts/ui.sh ready

## Component sources allowed
- [x] Preference order: shadcn/ui first, 21st.dev for hero/feature, custom last

## Per page / per block
> Repeat this block for every page and every section in it.
### Page: Home
- block: For hero section adapt https://21st.dev/community/components/dhiluxui/celestial-ink-shader/default to use our design system 
  present-as: backgroud should use the effect in the 21st dev element with our system colors and buttons
  source:  21st.dev 

- block: Featured Work
  present-as: 2 cards presenting 2 projects
  source: custom
  reference: https://www.baunfire.com/ the section just below the hero I especially like the on-hover motion
  motion: framer-motion
- block: What I do
  present as:  a custom section with horizontal scroll which will feature each major capability linked to the corresponding section of the capabilities page
  source: custom
  reference: build custom using framer motions or gsap
  motion: framer-motion or gsap
- block: Scrumtrulescent a block introducing my magazine publication and a cards to featured articles from it
  source: custom
  reference: custom
  
  ### Page: About
  -  Page should borrow elements from https://brittanychiang.com: Hybrid intro (It should work as an intro for my business and a personal bio intro), Animated on scroll timeline on one side with sticky cards on the left one for my interests (titled "the way I am" this should open a modal with my interests with images and categories presented in a fun way) and the other with my detailed biography (titled "who I am" this should open a modal with), Scrutrulescent (a section linking to my magazine publication with an intro into what it is and why it is here and what I hope they take away from it, social links: tiktok, youtube, X, bluesky and github (absolutely no linkedIn it's performative inauthentic bullshit totally antithetical to my brand). 
    source: custom
    Motion: Gsap, framer-motion

     
    
## Page: Capabilities 
Services section: Web development (beyond the website: payload cms (I build it you control it), landing pages, dashboards and internal tools), Custom software: Booking systems/ crms, mobile money/ payment gateway integration, ecommerce, AI integration: Customer care voice and chatbots, Receptionist bot, custom integrations, local AI. Technologies sectons: Intro on skillset and tools, a logo grid that does not scroll but animates a new set of logos into view after a few seconds, the logos should show the name of the technology and what I use it for on hover. Inspired by https://www.ramotion.com/ logos on the home page, How I work section: "What working with me looks like" shows engagement process from inquiry to signed contract and down payment to project handover - the ui for this should be borrowed from https://addepto.com/ai-integration-services/. The entire project should heavily borrow ideas for organizing the text content from this site https://addepto.com  
## Global elements
- [x] Header/nav treatment + reference: https://addepto.com copy the header from this site and adapt it to our design system
- [x] Footer treatment + reference: Create a custom monochromatic footer with links and a monochromatic logo

