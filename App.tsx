import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: 'Pop' | 'Hip-Hop' | 'R&B' | 'Rock' | 'Classical';
  downloaded?: boolean;
};

type Screen = 'home' | 'search' | 'playlist' | 'premium' | 'profile';

const TRACKS: Track[] = [
  { id: '1', title: 'Night Drive', artist: 'Ari Vale', album: 'Neon Lights', genre: 'Pop' },
  { id: '2', title: 'Pulse Beat', artist: 'Kota Rey', album: 'Momentum', genre: 'Hip-Hop' },
  { id: '3', title: 'Velvet Rain', artist: 'Ivy Moore', album: 'Cloudline', genre: 'R&B' },
  { id: '4', title: 'Shatter Sky', artist: 'The Northern Echo', album: 'Altitude', genre: 'Rock' },
  { id: '5', title: 'Moon Sonata Reimagined', artist: 'Lina K', album: 'Reworks', genre: 'Classical' },
];

const FILTERS: Array<Track['genre'] | 'All'> = ['All', 'Pop', 'Hip-Hop', 'R&B', 'Rock', 'Classical'];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [screen, setScreen] = useState<Screen>('home');
  const [query, setQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState<(typeof FILTERS)[number]>('All');
  const [favorites, setFavorites] = useState<string[]>(['1', '3']);
  const [recentlyPlayed, setRecentlyPlayed] = useState<string[]>(['2', '4']);
  const [playlistName, setPlaylistName] = useState('Road Trip Mix');
  const [playlistTrackIds, setPlaylistTrackIds] = useState<string[]>(['1', '2']);
  const [downloads, setDownloads] = useState<Record<string, boolean>>({});

  const filteredTracks = useMemo(() => {
    const lowered = query.toLowerCase();
    return TRACKS.filter((track) => {
      const genreMatch = genreFilter === 'All' || track.genre === genreFilter;
      const queryMatch =
        track.title.toLowerCase().includes(lowered) ||
        track.artist.toLowerCase().includes(lowered) ||
        track.album.toLowerCase().includes(lowered);
      return genreMatch && queryMatch;
    });
  }, [genreFilter, query]);

  const recommendationTracks = TRACKS.filter((track) => !favorites.includes(track.id)).slice(0, 3);

  const toggleFavorite = (id: string) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((fav) => fav !== id) : [...current, id],
    );
  };

  const togglePlaylistTrack = (id: string) => {
    setPlaylistTrackIds((current) =>
      current.includes(id) ? current.filter((trackId) => trackId !== id) : [...current, id],
    );
  };

  const toggleDownload = (id: string) => {
    setDownloads((current) => ({ ...current, [id]: !current[id] }));
  };

  const openTrack = (track: Track) => {
    setRecentlyPlayed((current) => [track.id, ...current.filter((id) => id !== track.id)].slice(0, 6));
    Alert.alert('Now Playing', `${track.title} • ${track.artist}`);
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.authCard}>
          <Text style={styles.brand}>HarmonyHub</Text>
          <Text style={styles.tagline}>Stream smarter. Discover faster. Share everywhere.</Text>

          <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#A5A8B8" />
          <TextInput style={styles.input} placeholder="Password" secureTextEntry placeholderTextColor="#A5A8B8" />
          {isRegistering && (
            <TextInput
              style={styles.input}
              placeholder="Display name"
              placeholderTextColor="#A5A8B8"
            />
          )}

          <Pressable style={styles.primaryBtn} onPress={() => setIsAuthenticated(true)}>
            <Text style={styles.primaryBtnText}>{isRegistering ? 'Create Account' : 'Login'}</Text>
          </Pressable>

          <Pressable onPress={() => setIsRegistering((s) => !s)}>
            <Text style={styles.switchAuth}>
              {isRegistering ? 'Already have an account? Login' : "New here? Create an account"}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>HarmonyHub</Text>
        <Pressable
          onPress={() => {
            setIsAuthenticated(false);
            setScreen('home');
          }}
        >
          <Text style={styles.link}>Logout</Text>
        </Pressable>
      </View>

      <View style={styles.navRow}>
        {(['home', 'search', 'playlist', 'premium', 'profile'] as Screen[]).map((tab) => (
          <Pressable key={tab} onPress={() => setScreen(tab)} style={styles.navBtn}>
            <Text style={[styles.navText, screen === tab && styles.navTextActive]}>{tab}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {screen === 'home' && (
          <>
            <Section title="Personalized Recommendations">
              {recommendationTracks.map((track) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  isFavorite={favorites.includes(track.id)}
                  isInPlaylist={playlistTrackIds.includes(track.id)}
                  isDownloaded={!!downloads[track.id]}
                  onPlay={openTrack}
                  onToggleFavorite={toggleFavorite}
                  onTogglePlaylist={togglePlaylistTrack}
                  onToggleDownload={toggleDownload}
                />
              ))}
            </Section>

            <Section title="Recently Played">
              {recentlyPlayed.map((id) => {
                const track = TRACKS.find((t) => t.id === id);
                if (!track) return null;
                return (
                  <TrackRow
                    key={track.id}
                    track={track}
                    isFavorite={favorites.includes(track.id)}
                    isInPlaylist={playlistTrackIds.includes(track.id)}
                    isDownloaded={!!downloads[track.id]}
                    onPlay={openTrack}
                    onToggleFavorite={toggleFavorite}
                    onTogglePlaylist={togglePlaylistTrack}
                    onToggleDownload={toggleDownload}
                  />
                );
              })}
            </Section>
          </>
        )}

        {screen === 'search' && (
          <>
            <TextInput
              style={styles.input}
              value={query}
              onChangeText={setQuery}
              placeholder="Search artist, album, genre"
              placeholderTextColor="#A5A8B8"
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
              {FILTERS.map((filter) => (
                <Pressable
                  key={filter}
                  onPress={() => setGenreFilter(filter)}
                  style={[styles.filterChip, genreFilter === filter && styles.filterChipActive]}
                >
                  <Text style={styles.filterText}>{filter}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <Section title={`Results (${filteredTracks.length})`}>
              <FlatList
                data={filteredTracks}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <TrackRow
                    track={item}
                    isFavorite={favorites.includes(item.id)}
                    isInPlaylist={playlistTrackIds.includes(item.id)}
                    isDownloaded={!!downloads[item.id]}
                    onPlay={openTrack}
                    onToggleFavorite={toggleFavorite}
                    onTogglePlaylist={togglePlaylistTrack}
                    onToggleDownload={toggleDownload}
                  />
                )}
              />
            </Section>
          </>
        )}

        {screen === 'playlist' && (
          <Section title="Playlist Creation & Management">
            <TextInput style={styles.input} value={playlistName} onChangeText={setPlaylistName} />
            <Text style={styles.playlistMeta}>{playlistTrackIds.length} tracks selected</Text>
            {TRACKS.map((track) => (
              <TrackRow
                key={track.id}
                track={track}
                isFavorite={favorites.includes(track.id)}
                isInPlaylist={playlistTrackIds.includes(track.id)}
                isDownloaded={!!downloads[track.id]}
                onPlay={openTrack}
                onToggleFavorite={toggleFavorite}
                onTogglePlaylist={togglePlaylistTrack}
                onToggleDownload={toggleDownload}
              />
            ))}
          </Section>
        )}

        {screen === 'premium' && (
          <Section title="Premium Subscription">
            <Text style={styles.cardText}>Unlock ad-free listening, high-quality audio, and unlimited downloads.</Text>
            <Pressable
              style={styles.primaryBtn}
              onPress={() => Alert.alert('Premium', 'Subscription checkout integration coming soon.')}
            >
              <Text style={styles.primaryBtnText}>Upgrade for $7.99/month</Text>
            </Pressable>
          </Section>
        )}

        {screen === 'profile' && (
          <Section title="Profile & Social Sharing">
            <Text style={styles.cardText}>Favorites: {favorites.length}</Text>
            <Text style={styles.cardText}>Downloaded: {Object.values(downloads).filter(Boolean).length}</Text>
            <Pressable
              style={styles.secondaryBtn}
              onPress={() => Alert.alert('Share', 'Shared your playlist to social media!')}
            >
              <Text style={styles.secondaryBtnText}>Share Current Playlist</Text>
            </Pressable>
          </Section>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

type TrackRowProps = {
  track: Track;
  isFavorite: boolean;
  isInPlaylist: boolean;
  isDownloaded: boolean;
  onPlay: (track: Track) => void;
  onToggleFavorite: (id: string) => void;
  onTogglePlaylist: (id: string) => void;
  onToggleDownload: (id: string) => void;
};

function TrackRow({
  track,
  isFavorite,
  isInPlaylist,
  isDownloaded,
  onPlay,
  onToggleFavorite,
  onTogglePlaylist,
  onToggleDownload,
}: TrackRowProps) {
  return (
    <View style={styles.trackRow}>
      <Pressable style={styles.trackInfo} onPress={() => onPlay(track)}>
        <Text style={styles.trackTitle}>{track.title}</Text>
        <Text style={styles.trackMeta}>
          {track.artist} • {track.album} • {track.genre}
        </Text>
      </Pressable>
      <View style={styles.trackActions}>
        <Pressable onPress={() => onToggleFavorite(track.id)}>
          <Text style={styles.icon}>{isFavorite ? '❤️' : '🤍'}</Text>
        </Pressable>
        <Pressable onPress={() => onTogglePlaylist(track.id)}>
          <Text style={styles.icon}>{isInPlaylist ? '✅' : '➕'}</Text>
        </Pressable>
        <Pressable onPress={() => onToggleDownload(track.id)}>
          <Text style={styles.icon}>{isDownloaded ? '⬇️' : '☁️'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090B16',
    paddingTop: 32,
  },
  authCard: {
    margin: 20,
    marginTop: 80,
    backgroundColor: '#12182A',
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  brand: {
    fontSize: 30,
    fontWeight: '800',
    color: '#EAF0FF',
  },
  tagline: {
    color: '#AFC0E6',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#2F3852',
    borderRadius: 10,
    padding: 12,
    color: '#F3F6FF',
    backgroundColor: '#10162A',
    marginBottom: 10,
  },
  primaryBtn: {
    backgroundColor: '#6C75FF',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  switchAuth: {
    color: '#A9B2DA',
    textAlign: 'center',
    marginTop: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  headerTitle: {
    color: '#E8EEFF',
    fontSize: 24,
    fontWeight: '800',
  },
  link: {
    color: '#95A1C9',
    fontWeight: '600',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderColor: '#1A2034',
    paddingBottom: 8,
  },
  navBtn: {
    paddingVertical: 4,
  },
  navText: {
    color: '#8B97BE',
    textTransform: 'capitalize',
  },
  navTextActive: {
    color: '#D9E2FF',
    fontWeight: '700',
  },
  body: {
    padding: 16,
    paddingBottom: 80,
    gap: 16,
  },
  section: {
    backgroundColor: '#11182B',
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 17,
    color: '#E9EEFF',
    fontWeight: '700',
  },
  trackRow: {
    backgroundColor: '#151E34',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  trackInfo: {
    flexShrink: 1,
  },
  trackTitle: {
    color: '#F4F7FF',
    fontWeight: '700',
  },
  trackMeta: {
    color: '#AAB6DB',
    fontSize: 12,
  },
  trackActions: {
    flexDirection: 'row',
    gap: 12,
  },
  icon: {
    fontSize: 18,
  },
  filterRow: {
    marginBottom: 8,
  },
  filterChip: {
    backgroundColor: '#1A2340',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#5862FB',
  },
  filterText: {
    color: '#E6EBFF',
    fontSize: 12,
    fontWeight: '700',
  },
  playlistMeta: {
    color: '#B3BDE3',
    marginBottom: 4,
  },
  cardText: {
    color: '#C9D3F4',
    marginBottom: 10,
    lineHeight: 20,
  },
  secondaryBtn: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#5E6ABE',
    padding: 12,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#D6DEFF',
    fontWeight: '700',
  },
});
