import * as React from 'react';
import styles from './SpFxDragItems.module.scss';
import { ISpFxDragItemsProps } from './ISpFxDragItemsProps';
import { escape } from '@microsoft/sp-lodash-subset';

import SectionsContainer from './SectionsContainer/SectionsContainerComponent';

export default class SpFxDragItems extends React.Component<ISpFxDragItemsProps, {}> {
  public render(): React.ReactElement<ISpFxDragItemsProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <section className={`${styles.spFxDragItems} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.welcome}>
          <h2>Hello, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div><strong>{escape(description)}</strong></div>
        </div>
        <div>
          <SectionsContainer />
        </div>
      </section>
    );
  }
}
