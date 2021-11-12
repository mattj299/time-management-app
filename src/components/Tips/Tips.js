import React, { useState, useEffect } from "react";
import "./styles.scss";

import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { IconContext } from "react-icons/lib";

// All code from here and scss file came from other project which is why classNames are quite different than the rest

function Tips() {
  useEffect(() => {
    const setFaqHeight = () => {
      const faqItem = document.getElementsByClassName("faq-item");
      const faqItemHeader = document.getElementsByClassName("faq-item-header");

      for (let i = 0; i < faqItem.length; i++) {
        const headerHeight = faqItemHeader[i].offsetHeight;

        faqItem[i].style.height = headerHeight + "px";
      }
    };

    window.addEventListener("resize", setFaqHeight);

    setFaqHeight();

    return () => {
      window.removeEventListener("resize", setFaqHeight);
    };
  }, []);
  return (
    <section className="faq-route">
      <div className="faq-route-wrapper container">
        <h2 className="section-header">Tips</h2>
        <div className="header-line"></div>
        <div className="header-line"></div>

        <p className="faq-route-description section-description">
          <b>Click on each one </b>for a short description of how to implement
          these tips for time management!
        </p>

        <p className="faq-route-description section-description">
          Tips to help manage your time
        </p>

        <div className="faq-route-items">
          <ul className="faq-route-items-ul">
            <FrequentlyAskedItem
              question="Set Goals"
              answer="Set goals for yourself whether short term goals or long term goals. Set a master list of something you want to accomplish for a long
              period of time as well as set short term daily goals that you can accomplish in the day. Set goals that are acheivable and prioritize these goals
              in your long term as well as daily life."
            />
            <FrequentlyAskedItem
              question="Manage your time"
              answer="As important as goals are there are going to be multiple goals you're going to need to accomplish for the day. 
              Set the time aside out of your day to do them. Set an appropriate time to do these goals and make sure they get done within that time frame. 
              The objective is to get the goals done in a timely manner in order to move onto your next till all goals are accomplished for the day."
            />
            <FrequentlyAskedItem
              question="Organize how you're going to do everything"
              answer="A website like this is perfect but use whichever is more convenient whether it being this application or just simply pen and paper.
              Write down what you need to do and within what time you need to get it done. Don't assume you're going to remember everything you need to do
              and at what time as it's going to not only confuse you but cause unnecessary stress on you. Start your day off with writing what needs to get done for
              the day or even better do it the night before! Have your daily as well as have your master list of goals and tweak them whenever necessary"
            />
            <FrequentlyAskedItem
              question="Take breaks"
              answer="Taking breaks can do so much for one's productivity just make sure to take the breaks wisely. A couple minutes of break to take your mind
              off all the work should be not only sufficient but relaxing as you take a bit of time to refocus on the work that needs to get done. Take them
              whenever you think is needed just make sure you don't make the mistake of transforming these strategic breaks into procrastination. Attention span
              can be a problem for some and these make a big difference to not only help with attention span but also the not feeling overworked."
            />
          </ul>
        </div>

        <p className="faq-route-description section-description">
          Benefits of time management
        </p>
        <div className="faq-route-items">
          <ul className="faq-route-items-ul">
            <FrequentlyAskedItem
              question="Stress relief"
              answer="Setting goals and completing them not only helps reduce anxiety but you also get to see the progess your making by checking or crossing
              things off your list of goals."
            />
            <FrequentlyAskedItem
              question="Daily progress"
              answer="Progress is important as it helps reach your goals. Daily progress in a timely manner not only helps you reach your goals faster
              but does so in a manner that's manageable and productive so you can reach your goals as soon as possible!"
            />
            <FrequentlyAskedItem
              question="More Time"
              answer="With time management you save yourself so much time! With good time management you can get the troublesome things out of the way and
              start focusing on things you enjoy doing such as hobbies or going out with family and friends."
            />
            <FrequentlyAskedItem
              question="Better habits"
              answer="When managing time it starts to become a healthy habit as it helps focus on priorities as well as helps with productivity done during the day."
            />
          </ul>
        </div>

        <p className="faq-route-description section-description">
          Consequences of poor time management
        </p>
        <div className="faq-route-items">
          <ul className="faq-route-items-ul">
            <FrequentlyAskedItem
              question="Potential stress and anxiety"
              answer="When not completing goals for example a school essay or not getting your clothes ready you then have to do it all last minute which
              causes stress, anxiety, and tension that starts to build up. With time management you not only reduce that stress but you give yourself more time
              for example on the weekend to go out as oppose to stuck at home writing a last minute essay or doing laundry."
            />
            <FrequentlyAskedItem
              question="Wasted Time"
              answer="Focusing on a task means complete focus until it gets done. Scrolling through social media or watching a show in the background can 
              cause your task to take double the time than you originally needed."
            />
            <FrequentlyAskedItem
              question="Bad Habits"
              answer="If you constantly wait last minute to do something you begin to realize it wasn't a one time thing. It constantly happen which causes
              bad habits to do things last minute which causes in hampered work."
            />
            <FrequentlyAskedItem
              question="Less time to relax"
              answer="With so many things to do there needs to be time for you to relax but if spending more time than needed on a task then it removes the
              time to relax. Scheduling when to do things and focusing on those things lets you completely focus on what needs to get done at hand."
            />
          </ul>
        </div>
      </div>
    </section>
  );
}

function FrequentlyAskedItem({ question, answer }) {
  const [selected, setSelected] = useState(false);

  // event is click event
  const changeSelected = (event) => {
    setSelected(!selected);

    // Looks for closest elements with these classes to toggle height when clicked
    const faqItem = event.target.closest(".faq-item");
    const faqItemHeader = event.target.closest(".faq-item-header");
    const faqItemExtend = event.target
      .closest(".faq-item")
      .querySelector(".faq-item-extend");

    const headerHeight = faqItemHeader.offsetHeight;
    const extendHeight = faqItemExtend.offsetHeight;

    // When faqItem is clicked toggle height to show or hide content
    // Change height from header to header+answer height then toggle back and forth
    if (!selected) {
      const extendedHeight = headerHeight + extendHeight;
      faqItem.style.height = extendedHeight + 16 + "px";
    } else {
      faqItem.style.height = headerHeight + "px";
    }
  };

  useEffect(() => {
    // When browser resizes this closes all faq items
    const selectedFalse = () => setSelected(false);

    window.addEventListener("resize", selectedFalse);

    return () => {
      window.removeEventListener("resize", selectedFalse);
    };
  }, []);

  return (
    <IconContext.Provider value={{ className: "faq-item-icon" }}>
      <li className={selected ? "faq-item selected" : "faq-item"}>
        <div
          className="faq-item-header"
          onClick={(event) => {
            changeSelected(event);
          }}
        >
          {selected ? <AiOutlineMinusCircle /> : <AiOutlinePlusCircle />}
          <p className="faq-item-question">{question}</p>
        </div>

        <div className="faq-item-extend">
          <p className="faq-item-answer">{answer}</p>
        </div>
      </li>
    </IconContext.Provider>
  );
}

export default Tips;
