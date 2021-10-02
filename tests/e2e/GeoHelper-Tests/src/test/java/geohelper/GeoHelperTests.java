package geohelper;

import com.intuit.karate.junit5.Karate;

public class GeoHelperTests {

    @Karate.Test
    Karate testAll() {
        return Karate.run().relativeTo(getClass());
    }
}
