import React, { useEffect, useRef, useState, ElementRef, ImgHTMLAttributes, MouseEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { scrollToBottom } from '../../../../../../utils/messages';
import { Message, Link, CustomCompMessage, GlobalState } from '../../../../../../store/types';
import { setBadgeCount, markAllMessagesRead } from '@actions';

import './styles.scss';
import Loader from './components/Loader';

type Props = {
  showTimeStamp: boolean,
  profileAvatar?: string;
}

const getContainerDiv = (): HTMLDivElement | null => {
  return document.querySelector('.rcw-messages-container');
};

const getMessagesDiv = (): HTMLDivElement | null => {
  return document.querySelector('.rcw-messages-container');
};

function Messages({ profileAvatar, showTimeStamp }: Props) {
  const dispatch = useDispatch();

  const { messages, typing, showChat, badgeCount } = useSelector((state: GlobalState) => ({
    messages: state.messages.messages,
    badgeCount: state.messages.badgeCount,
    typing: state.behavior.messageLoader,
    showChat: state.behavior.showChat
  }));

  const isScrolled = useRef(false);

  const handleMouseOver = () => {
    isScrolled.current = true;
  }

  const handleMouseOut = () => {
    isScrolled.current = false;
  }

  const messageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isScrolled.current) {
      return;
    }

    setTimeout(() => {
      scrollToBottom(
        getContainerDiv(),
        getMessagesDiv()
      );
    }, 50);
    setTimeout(() => {
      scrollToBottom(
        getContainerDiv(),
        getMessagesDiv()
      );
    }, 150);
    if (showChat && badgeCount) dispatch(markAllMessagesRead());
    else dispatch(setBadgeCount(messages.filter((message) => message.unread).length));
  }, [messages, badgeCount, showChat]);

  const handleScrollOnLoad = (ref) => {
    if (isScrolled.current) {
      return;
    }
    if (ref) {
      const rowOffset = ref.getOffsetForRow({ index: messages.length });
      if (rowOffset > 0) {
        setTimeout(() => {
          scrollToBottom(
            getContainerDiv(),
            getMessagesDiv()
          );
        }, 50);
        setTimeout(() => {
          scrollToBottom(
            getContainerDiv(),
            getMessagesDiv()
          );
        }, 150);
      }
    }
  };


  const getComponentToRender = (message: Message | Link | CustomCompMessage) => {
    const ComponentToRender = message.component as any;
    if (message.type === 'component') {
      return <ComponentToRender {...message.props} />;
    }
    return <ComponentToRender message={message} showTimeStamp={showTimeStamp} />;
  };

  // TODO: Fix this function or change to move the avatar to last message from response
  // const shouldRenderAvatar = (message: Message, index: number) => {
  //   const previousMessage = messages[index - 1];
  //   if (message.showAvatar && previousMessage.showAvatar) {
  //     dispatch(hideAvatar(index));
  //   }
  // }

  return (
    <div id='messages' className='rcw-messages-container' ref={messageRef} onMouseEnter={handleMouseOver} onMouseLeave={handleMouseOut}>
        {messages?.map((message, index) =>
            <div className="rcw-message" key={`${index}`}>
              {profileAvatar &&
                  message.showAvatar &&
                  <img src={profileAvatar} className="rcw-avatar" alt="profile" />
              }
              {getComponentToRender(message)}
            </div>
        )}
      <Loader typing={typing} />
    </div>
  );
}

export default Messages;
