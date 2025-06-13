import React from 'react';
import { Link } from 'react-router-dom';
import Flex from '../../components/layout/Flex/Flex';
import styles from './not-found-page.module.scss';
import { Button } from '../../components/common/Button/Button.tsx';

const NotFoundPage: React.FC = () => {
  return (
    <Flex
      direction="vertical"
      align="center"
      justify="center"
      className={styles.notFoundPage}
      fullWidth
      spacing="xl"
    >
      <div className={styles.notFoundPageTitle}>404 - Page Not Found</div>
      <div className={styles.notFoundPageText}>
        Oops! We could’t find that page. Maybe it rolled under the toy shelf?
      </div>
      <Link to="/">
        <Button appearance="secondary">Back to Home</Button>
      </Link>
    </Flex>
  );
};

export default NotFoundPage;
