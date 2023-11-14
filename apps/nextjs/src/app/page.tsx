import AlertsList from './_components/alerts/AlertsList';
import SideNav from './_components/SideNav';

/**
 * Home Page is the List Alerts view for now.
 */
const HomePage = () => {
  return (
    <main className="h-screen">
      <SideNav>
        <AlertsList />
      </SideNav>
    </main>
  );
};

export default HomePage;
