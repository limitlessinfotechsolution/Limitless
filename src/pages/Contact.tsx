import dynamic from 'next/dynamic';

const ContactComponent = dynamic(() => import('../components/contact/ContactComponent'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

const Contact: React.FC = () => {
  return <ContactComponent />;
};

export default Contact;
