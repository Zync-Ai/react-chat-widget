import React, { useEffect, useRef, useState, ElementRef, ImgHTMLAttributes, MouseEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import List from 'react-virtualized/dist/commonjs/List';
import CellMeasurer from 'react-virtualized/dist/commonjs/CellMeasurer';
import CellMeasurerCache from 'react-virtualized/dist/commonjs/CellMeasurer/CellMeasurerCache';

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 50
});

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
  return document.querySelector('.ReactVirtualized__List');
};

const getMessagesDiv = (): HTMLDivElement | null => {
  return document.querySelector('.ReactVirtualized__Grid__innerScrollContainer');
};

function Messages({ profileAvatar, showTimeStamp }: Props) {
  const dispatch = useDispatch();
  const { messages, typing, showChat, badgeCount } = useSelector((state: GlobalState) => ({
    messages: state.messages.messages,
    badgeCount: state.messages.badgeCount,
    typing: state.behavior.messageLoader,
    showChat: state.behavior.showChat
  }));

  const messageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
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
    const ComponentToRender = message.component;
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

  const list = messages || [];

  const rowRenderer = ({
                         key, // Unique key within array of rows
                         index, // Index of row within collection
                         isScrolling, // The List is currently being scrolled
                         isVisible, // This row is visible within the List (eg it is not an overscanned row)
                         style, // S
                         parent
                       }) => {
    const message = list[index];

    return <CellMeasurer
      parent={parent}
      cache={cache}
      columnIndex={0}
      rowIndex={index}
      key={key}
    >
      {({ registerChild }) => (
        <div ref={registerChild} className='rcw-message' style={style}>
          {profileAvatar &&
            message.showAvatar &&
            <img src={profileAvatar} className='rcw-avatar' alt='profile' />
          }
          {getComponentToRender(message)}
        </div>
      )}
    </CellMeasurer>;
  };

  return (
    <div id='messages' className='rcw-messages-container' ref={messageRef}>
      <AutoSizer>
        {({ width, height }) => (
          <List
            ref={handleScrollOnLoad}
            width={width}
            height={height}
            rowCount={list.length}
            rowRenderer={rowRenderer}
            deferredMeasurementCache={cache}
            rowHeight={cache.rowHeight}
          />
        )}
      </AutoSizer>
      <Loader typing={typing} />
    </div>
  );
}

export default Messages;
