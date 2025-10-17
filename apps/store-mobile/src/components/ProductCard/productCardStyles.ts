import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    flex: 1,
  },
  fullWidth: {
    width: '100%',
  },
  horizontalCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  image: {
    width: '100%',
    height: 180,
  },
  topRightButtons: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
  },
  infoContainer: {
    paddingTop: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  description: {
    color: '#777',
    marginTop: 4,
    fontSize: 13,
  },
  price: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e1e1e',
  },
});
