package gr.wind.FullStackSpring_Review.model;

public class TopXSitesAllTechs {
    private final String Dslam;
    private final String DslamOwner;
    private final String Outages;
    private final String MatchedWithTickets;

    public TopXSitesAllTechs(String dslam, String dslamOwner, String outages, String matchedWithTickets) {
        Dslam = dslam;
        DslamOwner = dslamOwner;
        Outages = outages;
        MatchedWithTickets = matchedWithTickets;
    }

    public String getDslam() {
        return Dslam;
    }

    public String getDslamOwner() {
        return DslamOwner;
    }

    public String getOutages() {
        return Outages;
    }

    public String getMatchedWithTickets() {
        return MatchedWithTickets;
    }
}
